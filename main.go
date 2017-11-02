package main

import (
	"os"
	"strconv"
)

func main() {
	a := App{}

	db_hostname := os.Getenv("DB_HOSTNAME")
	db_username := os.Getenv("DB_USERNAME")
	db_password :=	os.Getenv("DB_PASSWORD")
	db_name := os.Getenv("DB_NAME")
	db_post, _ := strconv.Atoi(os.Getenv("DB_PORT"))

	a.Initialize(db_hostname, db_post, db_username, db_password, db_name)

	a.Run(":8000")
}
