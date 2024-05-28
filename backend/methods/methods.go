package methods

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"project/database"
	"project/structure"

	"github.com/gin-gonic/gin"
)

var db, _ = database.DB()

func Create_Questions(c *gin.Context) {

	var question structure.QuestionKey
	body, err := io.ReadAll(c.Request.Body)

	if err != nil {
		fmt.Println(err.Error(), "is here")
		return
	}
	err = json.Unmarshal(body, &question)

	if err != nil {
		fmt.Println(question)
		fmt.Println(err.Error())
		return
	}

	//insertion
	insertQuery := "INSERT INTO questioncollection (question,ans1,ans2,ans3,ans4,correct_ans) VALUES(?,?,?,?,?,?)"

	_, err = db.Exec(insertQuery, question.Question, question.Ans1, question.Ans2, question.Ans3, question.Ans4, question.Correct_Ans)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "questions sheet inserted",
	})
	fmt.Println("data inserted")
}
func Get_Questions(c *gin.Context) {
	var questionList []structure.QuestionKey
	var questionKey structure.QuestionKey
	//fetching all questions
	fetchQuery := "SELECT * FROM questioncollection "
	rows, err := db.Query(fetchQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}
	for rows.Next() {
		err := rows.Scan(&questionKey.Id, &questionKey.Question, &questionKey.Ans1, &questionKey.Ans2, &questionKey.Ans3, &questionKey.Ans4, &questionKey.Correct_Ans)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		questionList = append(questionList, questionKey)
	}

	if err != nil {
		fmt.Println(err.Error())
		return
	}
	c.JSON(http.StatusOK, questionList)

}
func Update_Question(c *gin.Context) {
	var questionKey structure.QuestionKey
	q_id := c.Param("q_id")
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}
	err = json.Unmarshal(body, &questionKey)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	//updating the question
	updateQuery := "Update questioncollection SET question=?,ans1=?,ans2=?,ans3=?,ans4=? WHERE q_id=?"
	_, err = db.Exec(updateQuery, questionKey.Question, questionKey.Ans1, questionKey, questionKey.Ans2, questionKey.Ans3, questionKey.Ans4, q_id)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Question updated sucessfully",
	})
}

func Delete_Question(c *gin.Context) {
	q_id := c.Param("q_id")
	//delete data through id
	deleteQuery := "DELETE FROM  questioncollection WHERE q_id=?"
	_, err := db.Exec(deleteQuery, q_id)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "data delete sucessfully",
	})
}

func Ans_Checker(c *gin.Context) {
	q_id := c.Param("q_id")
	//reading body
	body, err := io.ReadAll(c.Request.Body)
	if body == nil {
		c.AbortWithStatus(http.StatusInternalServerError)
	}
	if err != nil {
		fmt.Println(err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	//decoding body
	var ansKey structure.AnsKey
	err = json.Unmarshal(body, &ansKey)
	if err != nil {
		fmt.Println(err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	//fetching through id
	fetchQuery := "SELECT correct_ans FROM questioncollection WHERE q_id=?"
	rows, err := db.Query(fetchQuery, q_id)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	var correct_ans string
	for rows.Next() {
		err := rows.Scan(&correct_ans)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	}
	if correct_ans == ansKey.Ans {
		c.JSON(http.StatusOK, gin.H{
			"message": "correct_answer",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"message": "incorrect_answer",
		})
	}
	defer rows.Close()
}
func InsertScore(c *gin.Context) {
	quiz_id := c.Param("quiz_id")
	body, err := io.ReadAll(c.Request.Body)
	userscore := structure.ScoreKey{}
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	err = json.Unmarshal(body, &userscore)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	//inserting data
	insertQuery := "UPDATE tablescores SET score=? WHERE quiz_id=?"
	_, err = db.Exec(insertQuery, userscore.Score, quiz_id)
	if err != nil {
		fmt.Println("failed to insert score")
		fmt.Println(err.Error())
		fmt.Println(userscore)
		return
	}
	fmt.Println("score inserted of ", userscore.Username)
	c.JSON(http.StatusOK, gin.H{
		"message": "score inserted",
	})
}

// tablescores
func Get_Table_Score(c *gin.Context) {
	scoreList := []structure.ScoreKey{}
	selectQuery := "SELECT * FROM tablescores"
	rows, err := db.Query(selectQuery)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	for rows.Next() {
		userScore := structure.ScoreKey{}
		err := rows.Scan(&userScore.Quiz_id, &userScore.Username, &userScore.Score)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		scoreList = append(scoreList, userScore)
	}
	c.JSON(http.StatusOK, scoreList)
}
