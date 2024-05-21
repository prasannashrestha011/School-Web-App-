package main

import (
	"fmt"
	"log"
	"net/http"
	"project/database"
	"project/methods"
	"project/strategy"

	"github.com/gin-gonic/gin"

	"github.com/gorilla/websocket"
)

type Client struct {
	connection *websocket.Conn
	Username   string
}

var clients = make(map[*websocket.Conn]*Client)
var broadcast = make(chan []byte)
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func websocketHandler(c *gin.Context) {
	username := c.Query("username")
	fmt.Println("username:", username)
	if username == " " {
		panic("username is required")
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error reading message:", err)
	}
	clients[conn] = &Client{connection: conn, Username: username}
	defer func() {
		delete(clients, conn)
		conn.Close()
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error writing message:", err)
			break
		}

		fmt.Println(string(message), "is from client")
		broadcast <- []byte(username + " :" + string(message))
	}
}
func broadCastMessage() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				delete(clients, client)
				client.Close()
				log.Println("Error reading message:", err)
				return
			}

		}
	}
}

func main() {
	database.Initializer()
	r := gin.Default()

	corsHandler := func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}
		c.Next()
	}
	go broadCastMessage()
	r.GET("/ws", websocketHandler)
	r.Use(corsHandler)
	r.POST("/registration", strategy.Registration)
	r.POST("/login", strategy.Authentication)
	r.POST("/create-question", methods.Create_Questions)
	r.GET("/get-questions", methods.Get_Questions)
	r.PUT("/update-question/:q_id", methods.Update_Question)
	r.DELETE("/delete-question/:q_id", methods.Delete_Question)

	r.POST("/check-answer/:q_id", methods.Ans_Checker)

	r.GET("/get-user-details/:username", strategy.GetUser)

	r.POST("/insert-score/:quiz_id", methods.InsertScore)

	r.Run(":8080")

	select {}
}
