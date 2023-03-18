package transaction

import (
	"net/http"

	"github.com/emPeeGee/raffinance/internal/auth"
	"github.com/emPeeGee/raffinance/pkg/errorutil"
	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
)

func RegisterHandlers(apiRg *gin.RouterGroup, service Service, validate *validator.Validate, logger log.Logger) {
	h := handler{service, logger, validate}

	api := apiRg.Group("/transactions")
	{
		api.GET("", h.getTransactions)
		// TODO: make it when transactions are available
		// api.GET("/:id", h.getTransaction)
		api.POST("", h.createTransaction)
		// api.PUT("/:id", h.updateTransaction)
		// api.DELETE("/:id", h.deleteTransaction)

	}
}

type handler struct {
	service  Service
	logger   log.Logger
	validate *validator.Validate
}

func (h *handler) createTransaction(c *gin.Context) {
	var input CreateTransactionDTO

	userId, err := auth.GetUserId(c)
	if err != nil || userId == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	if err := c.BindJSON(&input); err != nil {
		errorutil.BadRequest(c, "your request looks incorrect", err.Error())
		return
	}

	h.logger.Debug(input)

	if err := h.validate.Struct(input); err != nil {
		errorutil.BadRequest(c, "your request did not pass validation", err.Error())
		return
	}

	createdTransaction, err := h.service.createTransaction(*userId, input)
	if err != nil {
		errorutil.InternalServer(c, "It looks like name is already used", err.Error())
		return
	}

	c.JSON(http.StatusOK, createdTransaction)
}

// func (h *handler) updateTransaction(c *gin.Context) {
// 	var input updateTransactionDTO

// 	userId, err := auth.GetUserId(c)
// 	if err != nil || userId == nil {
// 		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
// 		return
// 	}

// 	TransactionId, err := strconv.ParseUint(c.Param("id"), 10, 32)
// 	if err != nil {
// 		errorutil.BadRequest(c, "wrong Transaction id", err.Error())
// 		return
// 	}

// 	if err := c.BindJSON(&input); err != nil {
// 		errorutil.BadRequest(c, "your request looks incorrect", err.Error())
// 		return
// 	}

// 	if err := h.validate.Struct(input); err != nil {
// 		errorutil.BadRequest(c, "your request did not pass validation", err.Error())
// 		return
// 	}

// 	updatedTransaction, err := h.service.updateTransaction(*userId, uint(TransactionId), input)
// 	if err != nil {
// 		errorutil.BadRequest(c, "error", err.Error())
// 		return
// 	}

// 	c.JSON(http.StatusOK, updatedTransaction)
// }

// func (h *handler) deleteTransaction(c *gin.Context) {
// 	userId, err := auth.GetUserId(c)
// 	if err != nil || userId == nil {
// 		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
// 		return
// 	}

// 	TransactionId, err := strconv.ParseUint(c.Param("id"), 10, 32)
// 	if err != nil {
// 		errorutil.BadRequest(c, err.Error(), "the id must be an integer")
// 		return
// 	}

// 	if err := h.service.deleteTransaction(*userId, uint(TransactionId)); err != nil {
// 		h.logger.Info(err.Error())
// 		errorutil.NotFound(c, err.Error(), "Not found")
// 		return
// 	}

// 	c.JSON(http.StatusOK, map[string]interface{}{
// 		"ok": true,
// 	})
// }

func (h *handler) getTransactions(c *gin.Context) {
	userId, err := auth.GetUserId(c)
	if err != nil || userId == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	transactions, err := h.service.getTransactions(*userId)
	if err != nil {
		errorutil.InternalServer(c, err.Error(), err.Error())
		return
	}

	c.JSON(http.StatusOK, transactions)
}
