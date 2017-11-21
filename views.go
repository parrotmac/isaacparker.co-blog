package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strconv"
)

func (a *App) createUser(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	unsafeUserDecoder := json.NewDecoder(r.Body)
	var unsafeUser UnsafeUser
	if err := unsafeUserDecoder.Decode(&unsafeUser); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(unsafeUser.Password), 10) // TODO: Use env var

	newUser := User{
		Email:        unsafeUser.Email,
		PasswordHash: hashedPassword,
		FirstName:    unsafeUser.FirstName,
		LastName:     unsafeUser.LastName,
		IsAdmin:      unsafeUser.IsAdmin,
	}

	if err := newUser.createUser(a.DB); err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusCreated, newUser)
}

func (a *App) updateUser(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, http.StatusNotImplemented, "Not yet implemented")
}

func (a *App) deleteUser(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, http.StatusNotImplemented, "Not yet implemented")
}

func (a *App) getUser(w http.ResponseWriter, r *http.Request) {

	requestVars := mux.Vars(r)
	requestedId, err := strconv.ParseUint(requestVars["id"], 10, 32)

	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	u := User{}
	u.ID = uint(requestedId)
	if err := u.getUser(a.DB); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, u)
}

func (a *App) getUsers(w http.ResponseWriter, r *http.Request) {
	users := getUserListing(a.DB)
	//if err != nil {
	//	respondWithError(w, http.StatusInternalServerError, err.Error())
	//	return
	//}

	respondWithJSON(w, http.StatusOK, users)
}

func (a *App) createPost(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)

	var bp BlogPost
	if err := decoder.Decode(&bp); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid post request payload")
		return
	}

	u := User{}
	u.ID = uint(bp.UserID)
	u.getUser(a.DB)

	bp.User = u

	if err := bp.createBlogPost(a.DB); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid post request payload -- "+err.Error())
		return
	}

	respondWithJSON(w, http.StatusCreated, bp)
}

func (a *App) updatePost(w http.ResponseWriter, r *http.Request) {
	requestVars := mux.Vars(r)
	requestedId, err := strconv.ParseUint(requestVars["id"], 10, 32)

	// :id is required, check for that
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid post ID")
		return
	}

	// Get current blog post to ensure it exists
	bp := BlogPost{}
	if err := bp.getBlogPost(a.DB, uint(requestedId)); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()

	// Decode json into fetched blog post
	if err := decoder.Decode(&bp); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid post request payload")
		return
	}

	// Update user
	// TODO: Update based on validated JWT claims
	u := User{}
	u.ID = uint(bp.UserID)
	u.getUser(a.DB)

	bp.User = u

	if err := bp.updateBlogPost(a.DB); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid post request payload -- "+err.Error())
		return
	}

	respondWithJSON(w, http.StatusCreated, bp)
}

func (a *App) deletePost(w http.ResponseWriter, r *http.Request) {
	requestVars := mux.Vars(r)
	requestedId, err := strconv.ParseUint(requestVars["id"], 10, 32)

	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	bp := BlogPost{}
	bp.ID = uint(requestedId)
	err = bp.deleteBlogPost(a.DB)

	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (a *App) getPost(w http.ResponseWriter, r *http.Request) {
	requestVars := mux.Vars(r)
	requestedId, err := strconv.ParseUint(requestVars["id"], 10, 32)

	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid post ID")
		return
	}

	bp := BlogPost{}
	if err := bp.getBlogPost(a.DB, uint(requestedId)); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, bp)
}

func (a *App) getPosts(w http.ResponseWriter, r *http.Request) {
	blogPosts := getPublishedBlogPosts(a.DB)
	respondWithJSON(w, http.StatusOK, blogPosts)
}
