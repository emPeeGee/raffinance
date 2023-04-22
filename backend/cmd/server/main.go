package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/emPeeGee/raffinance/internal/account"
	"github.com/emPeeGee/raffinance/internal/analytics"
	"github.com/emPeeGee/raffinance/internal/auth"
	"github.com/emPeeGee/raffinance/internal/category"
	"github.com/emPeeGee/raffinance/internal/config"
	"github.com/emPeeGee/raffinance/internal/connection"
	"github.com/emPeeGee/raffinance/internal/contact"
	"github.com/emPeeGee/raffinance/internal/cors"
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/internal/seeder"
	"github.com/emPeeGee/raffinance/internal/tag"
	"github.com/emPeeGee/raffinance/internal/transaction"
	"github.com/emPeeGee/raffinance/pkg/accesslog"
	"github.com/emPeeGee/raffinance/pkg/errorutil"
	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/emPeeGee/raffinance/pkg/validatorutil"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	_ "github.com/lib/pq"
	"gorm.io/gorm"
)

const Version = "1.0.0"

// TODO: jwt config to be extracted
// TODO: more linting linters to be added, like the linter for err check

// RUN: Before autoMigrate -> CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
func main() {
	logger := log.New().With(nil, "version", Version)

	if err := os.Setenv("TZ", "Universal"); err != nil {
		logger.Fatalf("Error setting environment variable")
	}

	cfg, err := config.Get(logger)
	if err != nil {
		logger.Fatalf("failed to initialize config: %s", err.Error())
	}

	db, err := connection.NewPostgresDB(cfg.DB)
	if err != nil {
		logger.Fatalf("failed to initialize db: %s", err.Error())
	}

	err = db.AutoMigrate(&entity.User{}, &entity.Contact{}, &entity.Account{}, &entity.Transaction{}, &entity.TransactionType{}, &entity.Category{}, &entity.Tag{}, &entity.TransactionTag{})
	if err != nil {
		logger.Fatalf("failed to auto migrate gorm", err.Error())
	}

	seeder := seeder.NewSeeder(db, logger)
	if err := seeder.Run(); err != nil {
		logger.Fatalf("Error has occurred while seeding: %s", err.Error())
	}

	server := new(connection.Server)
	valid := validator.New()
	if err := valid.RegisterValidation("currency", validatorutil.CurrencyValidator); err != nil {
		logger.Fatalf("failed to register currency validator: %s", err.Error())
	}

	if err := valid.RegisterValidation("transactiontype", validatorutil.TransactionType); err != nil {
		logger.Fatalf("failed to register transaction type validator: %s", err.Error())
	}

	// TODO: Error handling here
	valid.RegisterStructValidation(transaction.ValidateCreateTransaction, transaction.CreateTransactionDTO{})
	valid.RegisterStructValidation(transaction.ValidateUpdateTransaction, transaction.UpdateTransactionDTO{})

	go func() {
		if err := server.Run(cfg.Server, buildHandler(db, valid, logger)); err != nil {
			logger.Fatalf("Error occurred while running http server: %s", err.Error())
		}
	}()

	logger.Info("Raffinance Started")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit

	logger.Info("Raffinance Shutting Down")

	if err := server.Shutdown(context.Background()); err != nil {
		logger.Fatalf("error occurred on server shutting down: %s", err.Error())
	}
}

// TODO: How the dependencies injection can be done better?
// TODO: Logger is not passed as ref
// buildHandler sets up the HTTP routing and builds an HTTP handler.
func buildHandler(db *gorm.DB, valid *validator.Validate, logger log.Logger) http.Handler {
	router := gin.New()
	router.Use(accesslog.Handler(logger), errorutil.Handler(logger), cors.Handler())

	authRg := router.Group("/auth")
	apiRg := router.Group("/api", auth.HandleUserIdentity(logger))

	// transaction service is used in account as well
	transactionService := transaction.NewTransactionService(transaction.NewTransactionRepository(db, logger), logger)

	auth.RegisterHandlers(
		authRg,
		apiRg,
		auth.NewAuthService(auth.NewAuthRepository(db, logger), logger),
		valid,
		logger,
	)

	contact.RegisterHandlers(
		apiRg,
		contact.NewContactService(contact.NewContactRepository(db, logger), logger),
		valid,
		logger,
	)

	account.RegisterHandlers(
		apiRg,
		account.NewAccountService(transactionService, account.NewAccountRepository(db, logger), logger),
		valid,
		logger,
	)

	transaction.RegisterHandlers(
		apiRg,
		transactionService,
		valid,
		logger,
	)

	category.RegisterHandlers(
		apiRg,
		category.NewCategoryService(category.NewCategoryRepository(db, logger), logger),
		valid,
		logger,
	)

	tag.RegisterHandlers(
		apiRg,
		tag.NewTagService(tag.NewTagRepository(db, logger), logger),
		valid,
		logger,
	)

	analytics.RegisterHandlers(
		apiRg,
		analytics.NewAnalyticsService(analytics.NewAnalyticsRepository(db, logger), logger),
		valid,
		logger,
	)

	return router
}
