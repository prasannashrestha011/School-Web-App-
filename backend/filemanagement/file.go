package filemanagement

import (
	"fmt"
	"math/rand"
	"net/http"
	"project/database"
	"project/structure"
	"strconv"

	"github.com/gin-gonic/gin"
)

var db, _ = database.DB()

func UploadFile(c *gin.Context) {

	file, fileHeader, err := c.Request.FormFile("img-msg")
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(fileHeader.Filename)
	err = c.SaveUploadedFile(fileHeader, "./public/"+fileHeader.Filename)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": `http://localhost:8080/public/` + fileHeader.Filename,
	})
	defer file.Close()
}
func UploadPdf(c *gin.Context) {
	username := c.Param("username")
	fileName := c.Param("fileName")
	uploadedTime := c.Param("uploadedTime")
	file, fileHeader, err := c.Request.FormFile("pdf-file")
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	randomstring := strconv.Itoa(rand.Intn(9999))
	filePath := randomstring + "-" + fileHeader.Filename
	fmt.Println(fileHeader.Filename + " was uploaded into /public/pdf")
	//inserting into database
	insertQuery := "INSERT INTO filetable (file_by,file_path,file_name,time_uploaded) VALUES(?,?,?,?)"
	_, err = db.Exec(insertQuery, username, filePath, fileName, uploadedTime)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	err = c.SaveUploadedFile(fileHeader, "./public/pdf/"+filePath)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "pdf uploaded",
	})
	defer file.Close()
}
func GetPdf(c *gin.Context) {
	var pdfList []structure.PdfFile
	getQuery := "SELECT * FROM filetable"
	rows, err := db.Query(getQuery)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	for rows.Next() {
		pdf_file := structure.PdfFile{}
		err := rows.Scan(&pdf_file.Id, &pdf_file.Username, &pdf_file.FilePath, &pdf_file.FileName, &pdf_file.Time_Uploaded)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		pdfList = append(pdfList, pdf_file)
	}
	c.JSON(http.StatusOK, pdfList)
}
