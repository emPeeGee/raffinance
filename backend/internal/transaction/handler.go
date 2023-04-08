package transaction

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/emPeeGee/raffinance/internal/auth"
	"github.com/emPeeGee/raffinance/pkg/errorutil"
	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/emPeeGee/raffinance/pkg/util"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
)

func RegisterHandlers(apiRg *gin.RouterGroup, service Service, validate *validator.Validate, logger log.Logger) {
	h := handler{service, logger, validate}

	api := apiRg.Group("/transactions")
	{
		api.POST("", h.createTransaction)
		api.PUT("/:id", h.updateTransaction)
		api.DELETE("/:id", h.deleteTransaction)

		api.GET("", h.getTransactions)
		api.GET("/:id", h.getTransaction)
		// TODO: not good name, merge with getAll ??
		api.GET("/f", h.getTransactionsFiltered)
	}
}

type handler struct {
	service  Service
	logger   log.Logger
	validate *validator.Validate
}

func (h *handler) createTransaction(c *gin.Context) {
	var input CreateTransactionDTO

	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	if err := c.BindJSON(&input); err != nil {
		errorutil.BadRequest(c, "your request looks incorrect", err.Error())
		return
	}

	if err := h.validate.Struct(input); err != nil {
		errorutil.BadRequest(c, "your request did not pass validation", err.Error())
		return
	}

	createdTransaction, err := h.service.createTransaction(*userID, input)
	if err != nil {
		errorutil.InternalServer(c, err.Error(), "")
		return
	}

	c.JSON(http.StatusOK, createdTransaction)
}

func (h *handler) updateTransaction(c *gin.Context) {
	var input UpdateTransactionDTO

	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	transactionId, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		errorutil.BadRequest(c, "wrong transaction id", err.Error())
		return
	}

	if err := c.BindJSON(&input); err != nil {
		errorutil.BadRequest(c, "your request looks incorrect", err.Error())
		return
	}

	if err := h.validate.Struct(input); err != nil {
		errorutil.BadRequest(c, "your request did not pass validation", err.Error())
		return
	}

	updatedTransaction, err := h.service.updateTransaction(*userID, uint(transactionId), input)
	if err != nil {
		errorutil.BadRequest(c, "error", err.Error())
		return
	}

	c.JSON(http.StatusOK, updatedTransaction)
}

func (h *handler) deleteTransaction(c *gin.Context) {
	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	transactionId, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		errorutil.BadRequest(c, err.Error(), "the id must be an integer")
		return
	}

	if err := h.service.deleteTransaction(*userID, uint(transactionId)); err != nil {
		h.logger.Info(err.Error())
		errorutil.NotFound(c, err.Error(), "Not found")
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"ok": true,
	})
}

func (h *handler) getTransactions(c *gin.Context) {
	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	transactions, err := h.service.getTransactions(*userID)
	if err != nil {
		errorutil.InternalServer(c, err.Error(), err.Error())
		return
	}

	c.JSON(http.StatusOK, transactions)
}

func (h *handler) getTransactionsFiltered(c *gin.Context) {
	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	// TODO: validation for queries?

	var filter TransactionFilter

	filter.userID = userID
	filter.Description = c.Query("description")
	filter.Type, err = util.ParseStringToByte(c.Query("type"))
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	startMonth, endMonth, err := util.ParseMonthRange(c.Query("start_month"), c.Query("end_month"))
	if err != nil {
		errorutil.BadRequest(c, err.Error(), "")
		return
	}
	filter.StartMonth = startMonth
	filter.EndMonth = endMonth

	filter.Categories, err = util.ParseStringToUintArr(c.Query("categories"))
	if err != nil {
		errorutil.BadRequest(c, fmt.Errorf("invalid categories parameter: %w", err).Error(), "")
		return
	}

	filter.Tags, err = util.ParseStringToUintArr(c.Query("tags"))
	if err != nil {
		errorutil.BadRequest(c, fmt.Errorf("invalid tags parameter: %w", err).Error(), "")
		return
	}

	transactions, err := h.service.GetTransactionsByFilter(filter)
	if err != nil {
		errorutil.InternalServer(c, err.Error(), "")
		return
	}

	c.JSON(http.StatusOK, transactions)
}

func (h *handler) getTransaction(c *gin.Context) {
	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	transactionId, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		errorutil.BadRequest(c, err.Error(), "the id must be an integer")
		return
	}

	transaction, err := h.service.getTransaction(*userID, uint(transactionId))
	if err != nil {
		errorutil.InternalServer(c, err.Error(), err.Error())
		return
	}

	c.JSON(http.StatusOK, transaction)
}
