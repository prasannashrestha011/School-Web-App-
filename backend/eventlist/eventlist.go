package eventlist

import (
	"fmt"
	"log"
	"net/http"
	"project/database"
	"project/structure"

	"github.com/gin-gonic/gin"
)

var db, _ = database.DB()

func EventList(c *gin.Context) {
	var notificationList []structure.NotificationMessage
	selectQuery := "SELECT * FROM notificationchats"

	rows, err := db.Query(selectQuery)
	if err != nil {
		log.Println(err)
		return
	}
	for rows.Next() {
		notificationObj := structure.NotificationMessage{}
		err := rows.Scan(&notificationObj.Id, &notificationObj.Username, &notificationObj.Profile_URI, &notificationObj.NotificationMessage)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		notificationList = append(notificationList, notificationObj)
	}
	c.JSON(http.StatusOK, notificationList)
}
func EventInfo(c *gin.Context) {
	eventQuery := structure.NotificationMessage{}
	id := c.Query("id")
	selectQuery := "SELECT * FROM notificationchats WHERE id=?"
	rows, err := db.Query(selectQuery, id)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	for rows.Next() {
		err := rows.Scan(&eventQuery.Id, &eventQuery.Username, &eventQuery.Profile_URI, &eventQuery.NotificationMessage)
		if err != nil {
			fmt.Println(err.Error())
			return
		}

	}
	c.JSON(http.StatusOK, eventQuery)
}
