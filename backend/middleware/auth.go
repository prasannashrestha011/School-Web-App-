package middleware

import (
	"net/http"
	"project/jwttoken"

	"github.com/gin-gonic/gin"
)

func RequireAuth(c *gin.Context) {
	tokenString, err := c.Cookie("Authorization")
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"Error": "Token not found",
		})

	}
	err = jwttoken.VerifyToken(tokenString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		c.AbortWithStatus(http.StatusInternalServerError)

	}
	c.Next()

}
