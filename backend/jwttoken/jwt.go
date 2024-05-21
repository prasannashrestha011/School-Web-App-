package jwttoken

import (
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func CreateToken(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": username,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		fmt.Println("from jwt", err.Error())
		return "", nil
	}
	return tokenString, nil
}
func VerifyToken(tokenString string) error {
	privateKey := []byte(os.Getenv("SECRET_KEY"))
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return privateKey, nil
	})
	if err != nil {
		fmt.Println(err.Error())
	}
	if !token.Valid {
		return fmt.Errorf("invalid token")
	}
	return nil
}
