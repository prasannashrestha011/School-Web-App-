package strategy

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"

	"project/database"
	"project/hashing"
	"project/jwttoken"
	"project/structure"
)

var db, err = database.DB()
var datakey = structure.DataKey{}

func Registration(c *gin.Context) {
	if err != nil {
		fmt.Println("failed to connection to database")
	}

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println("failed to read the body")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	err = json.Unmarshal(body, &datakey)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	//hashing password
	hashedPassword, err := hashing.HashPassword(datakey.Password)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	//inserting into database
	insertQuery := "INSERT INTO usercredentials (username,password,role) VALUES(?,?,?)"
	_, err = db.Exec(insertQuery, datakey.Username, hashedPassword, datakey.Role)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "data insertion sucessful",
	})
}

func Authentication(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	//decoding body
	err = json.Unmarshal(body, &datakey)

	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fetchUserQuery := "SELECT * FROM usercredentials WHERE username=?"
	rows, err := db.Query(fetchUserQuery, datakey.Username)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	retrivedUserData := structure.DataKey{}
	for rows.Next() {
		err := rows.Scan(&retrivedUserData.Id, &retrivedUserData.Username, &retrivedUserData.Password, &retrivedUserData.Role)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	}

	isAuthenticated := hashing.ComparePassword(retrivedUserData.Password, datakey.Password)

	if isAuthenticated {
		tokenString, err := jwttoken.CreateToken(datakey.Username)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("Authorization", tokenString, 3600*24*1, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{
			"message": "authenticated",
			"user": gin.H{
				"id":       retrivedUserData.Id,
				"username": retrivedUserData.Username,
				"role":     retrivedUserData.Role,
			},
		})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
	}
}
func GetUser(c *gin.Context) {
	username := c.Param("username")
	var fetch_role string
	fetchUserQuery := "SELECT role from usercredentials where username=?"
	rows, err := db.Query(fetchUserQuery, username)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	for rows.Next() {
		err := rows.Scan(&fetch_role)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"role": fetch_role,
	})
	fmt.Println("user detail sent")
}
func InsertUserInfo(c *gin.Context) {
	userInfo := structure.UserInfo{}
	body, err := io.ReadAll(c.Request.Body)

	if err != nil {
		fmt.Println(err.Error())
		return
	}
	err = json.Unmarshal(body, &userInfo)
	fmt.Println(userInfo.Id)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	insertQuery := "INSERT INTO userinfo (google_id,email,name,profileURL,verify_email) VALUES(?,?,?,?,?)"
	_, err = db.Exec(insertQuery, userInfo.Id, userInfo.Email, userInfo.Name, userInfo.ProfileURL, userInfo.Verify_Email)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "data inserted",
	})

}
func GetUserInfo(c *gin.Context) {
	userInfo := structure.UserInfo{}
	user_id := c.Param("id")
	selectQuery := "SELECT * FROM userinfo where google_id=?"
	rows, err := db.Query(selectQuery, user_id)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	for rows.Next() {
		err = rows.Scan(&userInfo.Id, &userInfo.Email, &userInfo.Name, &userInfo.ProfileURL, &userInfo.Verify_Email)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	}
	c.JSON(http.StatusOK, userInfo)
}
