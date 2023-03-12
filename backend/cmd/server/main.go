package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/emPeeGee/raffinance/internal/config"
	"github.com/emPeeGee/raffinance/internal/connection"
	"github.com/emPeeGee/raffinance/pkg/log"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	_ "github.com/lib/pq"
	"gorm.io/gorm"
)

const Version = "1.0.0"

// TODO: jwt config to be extracted

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

	// err = db.AutoMigrate(&entity.Thought{}, &entity.User{})
	// if err != nil {
	// 	logger.Fatalf("failed to auto migrate gorm", err.Error())
	// }

	server := new(connection.Server)
	valid := validator.New()

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

// buildHandler sets up the HTTP routing and builds an HTTP handler.
func buildHandler(db *gorm.DB, valid *validator.Validate, logger log.Logger) http.Handler {
	router := gin.New()
	// router.Use(accesslog.Handler(logger), flaw.Handler(logger), cors.Handler())

	// authRg := router.Group("/auth")
	// apiRg := router.Group("/api", auth.HandleUserIdentity(logger))

	// auth.RegisterHandlers(
	// 	authRg,
	// 	apiRg,
	// 	auth.NewAuthService(auth.NewAuthRepository(db, logger), logger),
	// 	valid,
	// 	logger,
	// )

	return router
}
