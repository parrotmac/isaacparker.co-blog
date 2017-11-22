package main

import (
	"net/http"
	"golang.org/x/crypto/bcrypt"
	"encoding/json"
	"strings"
	"github.com/dgrijalva/jwt-go"
	"strconv"
)

type RawCredentials struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

func (a *App) authenticate(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	decoder := json.NewDecoder(r.Body)

	var rawCredentials RawCredentials
	if err := decoder.Decode(&rawCredentials); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid authentication payload")
		return
	}


	if len(rawCredentials.Email) == 0 || len(rawCredentials.Password) == 0 {
		respondWithError(w, http.StatusBadRequest, "Please provide name and password to obtain a token.")
		return
	}

	authenticationFailed := false

	u := User{Email:rawCredentials.Email}
	err := u.getUserByEmailUnsafe(a.DB)
	if err != nil {
		authenticationFailed = true
	} else {
		err = bcrypt.CompareHashAndPassword(u.PasswordHash, []byte(rawCredentials.Password))
		if err != nil {
			authenticationFailed = true
		}
	}

	// Respond with generic auth failure if user wasn't found or password was incorrect
	if authenticationFailed {
		respondWithError(w, http.StatusUnauthorized, "Unable to authenticate")
		return
	}

	token, err := a.getToken(&u)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error generating JWT token: "+err.Error())
		return
	}

	w.Header().Set("Authorization", "Bearer "+token)
	respondWithJSON(w, http.StatusOK, struct{
		Token string `json:"token"`
	}{Token: token})

}

func (a *App) loginRequired(next func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			respondWithError(w, http.StatusUnauthorized, "Missing Authorization Header")
			return
		}

		clientToken := strings.Replace(authHeader, "Bearer ", "", 1)
		claims, err := a.verifyToken(clientToken)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Unable to verify JWT")
			return
		}

		firstName := claims.(jwt.MapClaims)["firstName"].(string)
		isAdmin := claims.(jwt.MapClaims)["isAdmin"].(bool)
		userId := claims.(jwt.MapClaims)["userId"].(float64)

		r.Header.Set("firstName", firstName)
		r.Header.Set("isAdmin", strconv.FormatBool(isAdmin))
		r.Header.Set("userId", strconv.FormatInt(int64(userId), 10))

		next(w, r)

	})
}

func (a *App) authTest(w http.ResponseWriter, r *http.Request) {

	authHeader := r.Header.Get("Authorization")

	if authHeader == "" {
		respondWithError(w, http.StatusUnauthorized, "Missing Authorization Header")
		return
	}

	clientToken := strings.Replace(authHeader, "Bearer ", "", 1)
	_, err := a.verifyToken(clientToken) // _ is claims

	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Unable to verify JWT")
		return
	}

	respondWithJSON(w, http.StatusOK, struct{Status string `json:"status"`}{Status: "success"})
}
