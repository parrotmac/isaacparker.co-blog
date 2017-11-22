package main

import (
	"os"
	"strconv"
	"log"
)

func main() {
	a := App{}

	jwtKey := os.Getenv("JWT_SECRET_KEY")
	if jwtKey == "" {
		jwtKey = "testkey"
	}
	a.jwtKey = []byte(jwtKey)

	portNum, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		log.Fatal("DB_PORT may not be specified correctly")
	}

	dbConnInfo := DBConnectionInfo{
		hostname: os.Getenv("DB_HOSTNAME"),
		username: os.Getenv("DB_USERNAME"),
		password: os.Getenv("DB_PASSWORD"),
		name:os.Getenv("DB_NAME"),
		port:portNum,
	}

	a.Initialize(dbConnInfo)

	a.Run(":8000")
}
