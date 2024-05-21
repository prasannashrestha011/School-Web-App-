package database

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

func Initializer() {
	db, err := sql.Open("mysql", "root:9843@tcp(localhost:3306)/quiz")
	if err != nil {
		fmt.Println("connection failed to database")
	} else {
		fmt.Println("connection sucessfull")
	}
	defer db.Close()
}
func DB() (*sql.DB, error) {
	db, err := sql.Open("mysql", "root:9843@tcp(localhost:3306)/quiz")
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}
	return db, nil
}
