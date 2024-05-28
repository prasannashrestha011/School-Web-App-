package Userchat

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"project/database"
	"project/structure"

	"github.com/gin-gonic/gin"
)

var db, err = database.DB()

func InsertMessages(c *gin.Context) {
	username := c.Param("username")
	userMessage := structure.UserMessage{}
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	err = json.Unmarshal(body, &userMessage)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	insertQuery := "INSERT INTO userconversation (username,user_message) VALUES(?,?)"
	_, err = db.Exec(insertQuery, username, userMessage.Message)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "messages inserted",
	})
}
func GetMessages() ([]structure.UserMessage, error) {

	var userMessageList []structure.UserMessage
	getQuery := "Select * FROM userconversation"
	rows, err := db.Query(getQuery)
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}
	for rows.Next() {
		userMessages := structure.UserMessage{}
		err := rows.Scan(&userMessages.Id, &userMessages.Username, &userMessages.Message)
		if err != nil {
			fmt.Println(err.Error())
			return nil, err
		}
		userMessageList = append(userMessageList, userMessages)
	}
	return userMessageList, nil
}
func GetMessageSince() (structure.UserMessage, error) {
	getQuery := "SELECT * FROM userconversation ORDER BY user_id DESC LIMIT 1"
	newUserMessage := structure.UserMessage{}
	rows, err := db.Query(getQuery)
	if err != nil {
		fmt.Println(err.Error())
		return newUserMessage, err
	}
	for rows.Next() {
		err := rows.Scan(&newUserMessage.Id, &newUserMessage.Username, &newUserMessage.Message)
		if err != nil {
			fmt.Println(err.Error())
			return newUserMessage, err
		}
	}
	return newUserMessage, nil
}
