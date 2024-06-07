package dashboard

import (
	"log"
	"net/http"
	"project/database"
	"project/structure"

	"github.com/gin-gonic/gin"
)

var db, _ = database.DB()

func GetDashBoardMessage(c *gin.Context) {
	dashBoardMessageList := []structure.DashBoardMessage{}
	selectQuery := "SELECT * FROM dashboardmessage ORDER BY id DESC"
	rows, err := db.Query(selectQuery)
	if err != nil {
		log.Println(err.Error())
		return
	}
	for rows.Next() {
		dashBoardMessageObj := structure.DashBoardMessage{}
		err := rows.Scan(&dashBoardMessageObj.Id,
			&dashBoardMessageObj.Username,
			&dashBoardMessageObj.Profile_URI,
			&dashBoardMessageObj.Time_Uploaded,
			&dashBoardMessageObj.Message)
		if err != nil {
			log.Println(err.Error())
			return
		}
		dashBoardMessageList = append(dashBoardMessageList, dashBoardMessageObj)
	}
	c.JSON(http.StatusOK, dashBoardMessageList)
}
