package oauth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOauthConfig = &oauth2.Config{}

func GoogleOathInit() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	googleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:3000",
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_SECRET_KEY"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
}

func GoogleCallbackHandler(c *gin.Context) {
	code := c.Query("code")
	token, err := googleOauthConfig.Exchange(context.Background(), code)

	if err != nil {
		fmt.Println("Error exchanging code: " + err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userInfo, err := GetUserInfo(token.AccessToken)
	if err != nil {
		fmt.Println("Error getting user info: " + err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": userInfo})
}
func GetUserInfo(accessToken string) (map[string]interface{}, error) {

	res, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}
	var userInfo map[string]interface{}
	err = json.NewDecoder(res.Body).Decode(&userInfo)
	fmt.Println(userInfo, "is user prop;;;;;;;;;;;;;;;;;;;;")
	if err != nil {
		fmt.Println(err, "is from get user info	")

		return nil, err
	}
	return userInfo, nil
}
func SignJWT(userInfo map[string]interface{}) (string, error) {
	claims := jwt.MapClaims{
		"sub":   userInfo["id"],
		"name":  userInfo["name"],
		"email": userInfo["email"],
		"iss":   "oauth-app-golang",
		"exp":   time.Now().Add(time.Hour * 24 * 30).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte("SECRET_KEY"))
	if err != nil {
		fmt.Println(err.Error())
		return "", err
	}
	return signedToken, nil
}
