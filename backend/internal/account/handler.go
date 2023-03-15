package account

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/emPeeGee/raffinance/internal/auth"
	"github.com/emPeeGee/raffinance/pkg/errorutil"
	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
)

func RegisterHandlers(apiRg *gin.RouterGroup, service Service, validate *validator.Validate, logger log.Logger) {
	h := handler{service, logger, validate}

	api := apiRg.Group("/accounts")
	{
		api.GET("", h.getAccounts)
		// TODO: make it when transactions are available
		// api.GET("/:id", h.getAccount)
		api.POST("", h.createAccount)
		api.PUT("/:id", h.updateAccount)
		api.DELETE("/:id", h.deleteAccount)

	}
}

type handler struct {
	service  Service
	logger   log.Logger
	validate *validator.Validate
}

func (h *handler) createAccount(c *gin.Context) {
	var input createAccountDTO

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

	err = h.service.createAccount(*userId, input)
	if err != nil {
		errorutil.InternalServer(c, "It looks like name is already used", err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"ok": true,
	})
}

func (h *handler) updateAccount(c *gin.Context) {
	var input updateAccountDTO

	userId, err := auth.GetUserId(c)
	if err != nil || userId == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	accountId, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		errorutil.BadRequest(c, "wrong account id", err.Error())
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

	updatedAccount, err := h.service.updateAccount(*userId, uint(accountId), input)
	if err != nil {
		errorutil.BadRequest(c, "error", err.Error())
		return
	}

	fmt.Printf("\n Here, %v \n", updatedAccount)

	c.JSON(http.StatusOK, updatedAccount)
}

func (h *handler) deleteAccount(c *gin.Context) {
	userId, err := auth.GetUserId(c)
	if err != nil || userId == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	accountId, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		errorutil.BadRequest(c, err.Error(), "the id must be an integer")
		return
	}

	if err := h.service.deleteAccount(*userId, uint(accountId)); err != nil {
		h.logger.Info(err.Error())
		errorutil.NotFound(c, err.Error(), "Not found")
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"ok": true,
	})
}

func (h *handler) getAccounts(c *gin.Context) {
	userId, err := auth.GetUserId(c)
	if err != nil || userId == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	accounts, err := h.service.getAccounts(*userId)
	if err != nil {
		errorutil.InternalServer(c, "something went wrong, we are working", err.Error())
		return
	}

	c.JSON(http.StatusOK, accounts)
}