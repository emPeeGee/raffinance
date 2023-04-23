package analytics

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

	api := apiRg.Group("/analytics")
	{
		api.GET("/trendBalance", h.GetTrendBalanceReport)
		api.GET("/topTxn", h.GetTopTransactions)
		api.GET("/categoriesSpending", h.GetCategoriesSpending)
		api.GET("/categoriesIncome", h.GetCategoriesIncome)
	}
}

type handler struct {
	service  Service
	logger   log.Logger
	validate *validator.Validate
}

func (h *handler) GetTrendBalanceReport(c *gin.Context) {
	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	params := &RangeDateParams{}
	if err := c.ShouldBindQuery(params); err != nil {
		errorutil.BadRequest(c, err.Error(), "")
		return
	}

	if err := h.validate.Struct(params); err != nil {
		errorutil.BadRequest(c, err.Error(), "")
		return
	}

	data, err := h.service.GetTrendBalanceReport(*userID, params)
	if err != nil {
		errorutil.InternalServer(c, err.Error(), "")
		return
	}

	c.JSON(http.StatusOK, data)
}

func (h *handler) GetTopTransactions(c *gin.Context) {
	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "missing user ID")
		return
	}

	params := &TopTransactionsParams{}
	if err := c.ShouldBindQuery(params); err != nil {
		errorutil.BadRequest(c, err.Error(), "")
		return
	}

	if err := h.validate.Struct(params); err != nil {
		errorutil.BadRequest(c, err.Error(), "")
		return
	}

	topTransactions, err := h.service.GetTopTransactions(*userID, params)
	if err != nil {
		errorutil.InternalServer(c, err.Error(), "")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": topTransactions})
}

func (h *handler) GetCategoriesSpending(c *gin.Context) {
	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "missing user ID")
		return
	}

	params := &RangeDateParams{}
	if err := c.ShouldBindQuery(params); err != nil {
		errorutil.BadRequest(c, err.Error(), "")
		return
	}

	if err := h.validate.Struct(params); err != nil {
		errorutil.BadRequest(c, err.Error(), "")
		return
	}

	spending, err := h.service.GetCategoriesSpending(*userID, params)
	if err != nil {
		errorutil.InternalServer(c, err.Error(), "")
		return
	}

	c.JSON(http.StatusOK, spending)
}

func (h *handler) GetCategoriesIncome(c *gin.Context) {
	userID, err := auth.GetUserId(c)
	if err != nil || userID == nil {
		errorutil.Unauthorized(c, err.Error(), "missing user ID")
		return
	}

	params := &RangeDateParams{}
	if err := c.ShouldBindQuery(params); err != nil {
		errorutil.BadRequest(c, err.Error(), "")
		return
	}

	if err := h.validate.Struct(params); err != nil {
		errorutil.BadRequest(c, err.Error(), "")
		return
	}

	income, err := h.service.GetCategoriesIncome(*userID, params)
	if err != nil {
		errorutil.InternalServer(c, err.Error(), "")
		return
	}

	c.JSON(http.StatusOK, income)
}
