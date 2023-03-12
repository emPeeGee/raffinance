package auth

import (
	"strings"

	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/gin-gonic/gin"
)

const (
	authorizationHeader = "Authorization"
	userCtx             = "userId"
)

func HandleUserIdentity(logger log.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader(authorizationHeader)
		if header == "" {
			logger.Info("Unauthenticated request")
			//flaw.Unauthorized(c, "empty auth header", "")
			return
		}

		headerParts := strings.Split(header, " ")
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			// flaw.Unauthorized(c, "invalid auth header", "")
			return
		}

		if len(headerParts[1]) == 0 {
			// flaw.Unauthorized(c, "token is empty", "")
			return
		}

		userId, err := parseToken(headerParts[1])
		if err != nil {
			// flaw.Unauthorized(c, "", err.Error())
			return
		}

		c.Set(userCtx, userId)
	}
}
