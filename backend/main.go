package main

import (
	"fmt"
	"log"
	"net/http"
	"project/Userchat"
	"project/database"
	"project/filemanagement"
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
var db, _ = database.DB()

func SendMessageToClient(client *websocket.Conn) {
	message, err := Userchat.GetMessages()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	for _, msg := range message {
		err := client.WriteMessage(websocket.TextMessage, []byte(msg.Username+"__"+msg.Message))
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	}
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
	SendMessageToClient(conn)
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error writing message:", err)
			break
		}
		_, err = db.Exec("INSERT INTO userconversation (username,user_message) VALUES(?,?)", username, message)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		fmt.Println(string(message), "is from client")
		broadcast <- []byte(username + " __" + string(message))

	}
}
func broadCastMessage() {
	for {
		msg := <-broadcast

		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			fmt.Println("message broadcast")
			if err != nil {
				delete(clients, client)
				clients[client].connection.Close()
				log.Println("Error reading message:", err)
				return
			}

		}

	}
}

func main() {
	database.Initializer()
	r := gin.Default()
	go broadCastMessage()
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

	r.GET("/ws", websocketHandler)
	r.Use(corsHandler)

	//static file server
	r.StaticFS("public", http.Dir("./public"))
	r.POST("/registration", strategy.Registration)
	r.POST("/login", strategy.Authentication)
	r.POST("/create-question", methods.Create_Questions)
	r.GET("/get-questions", methods.Get_Questions)
	r.PUT("/update-question/:q_id", methods.Update_Question)
	r.DELETE("/delete-question/:q_id", methods.Delete_Question)

	r.POST("/check-answer/:q_id", methods.Ans_Checker)

	r.GET("/get-user-details/:username", strategy.GetUser)

	r.POST("/insert-score/:quiz_id", methods.InsertScore)
	r.GET("/get-scores", methods.Get_Table_Score)

	r.POST("/upload-image", filemanagement.UploadFile)
	r.POST("/upload-pdf/:username/:fileName", filemanagement.UploadPdf)
	r.GET("/get-pdf", filemanagement.GetPdf)
	r.POST("/insert-messages/:username", Userchat.InsertMessages)

	r.Run(":8080")

	select {}
}
