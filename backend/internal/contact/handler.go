package contact

import (
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

	api := apiRg.Group("/contacts")
	{
		api.GET("", h.getContacts)
		// api.GET("/:id", h.createContact)
		api.POST("", h.createContact)
		api.PUT("/:id", h.updateContact)
		// an contact can be associated with many
		api.DELETE("/:id", h.deleteContact)

	}
}

type handler struct {
	service  Service
	logger   log.Logger
	validate *validator.Validate
}

func (h *handler) createContact(c *gin.Context) {
	var input createContactDTO

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

	err = h.service.createContact(*userId, input)
	if err != nil {
		errorutil.InternalServer(c, "It looks like email or name are already used", err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"ok": true,
	})
}

func (h *handler) updateContact(c *gin.Context) {
	var input updateContactDTO

	userId, err := auth.GetUserId(c)
	if err != nil || userId == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	contactId, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		errorutil.BadRequest(c, "wrong contact id", err.Error())
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

	updatedContact, err := h.service.updateContact(*userId, uint(contactId), input)
	if err != nil {
		errorutil.BadRequest(c, "error", err.Error())
		return
	}

	c.JSON(http.StatusOK, updatedContact)
}

func (h *handler) deleteContact(c *gin.Context) {}

func (h *handler) getContacts(c *gin.Context) {
	userId, err := auth.GetUserId(c)
	if err != nil || userId == nil {
		errorutil.Unauthorized(c, err.Error(), "you are not authorized")
		return
	}

	contacts, err := h.service.getContacts(*userId)
	if err != nil {
		errorutil.InternalServer(c, "something went wrong, we are working", err.Error())
		return
	}

	c.JSON(http.StatusOK, contacts)
}
