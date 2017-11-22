package main

import (
	jwt "github.com/dgrijalva/jwt-go"
	"net/http"
	"strings"
)

func (a *App) getToken(user *User) (string, error) {
	signingKey := a.jwtKey
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID,
		"firstName": user.FirstName,
		"isAdmin": user.IsAdmin,
	})
	tokenString, err := token.SignedString(signingKey)
	return tokenString, err
}

func (a *App) verifyToken(tokenString string) (jwt.Claims, error) {
	signingKey := a.jwtKey
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})
	if err != nil {
		return nil, err
	}
	return token.Claims, err
}

func (a *App) getClaims(r *http.Request) jwt.Claims {

	authHeader := r.Header.Get("Authorization")

	clientToken := strings.Replace(authHeader, "Bearer ", "", 1)
	claims, err := a.verifyToken(clientToken)
	if err != nil {
		return nil
	}

	return claims
}
