package main

import (
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"fmt"
	"net/http"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"strconv"
)

type App struct {
	Router *mux.Router
	APIRouter *mux.Router
	DB *gorm.DB
}

func (a *App) Initialize(hostname string, port int, user, password, dbname string) {
	connectionString :=
		fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", hostname, port, user, password, dbname)

	var err error
	a.DB, err = gorm.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	if ! a.DB.HasTable(&User{}) {
		a.DB.CreateTable(&User{})
	}
	if ! a.DB.HasTable(&BlogPost{}) {
		a.DB.CreateTable(&BlogPost{})
	}
	if ! a.DB.HasTable(&PortfolioProject{}) {
		a.DB.CreateTable(&PortfolioProject{})
	}

	a.DB.AutoMigrate(&User{})
	a.DB.AutoMigrate(&BlogPost{})
	a.DB.AutoMigrate(&PortfolioProject{})

	a.Router = mux.NewRouter()
	a.Router.StrictSlash(true)
	a.APIRouter = a.Router.PathPrefix("/api").Subrouter()
	a.initializeApiRoutes()
	a.initializeAuthRoutes()
	a.initializeFrontendRoutes()
}

func (a *App) Run(addr string) {
	log.Fatal(http.ListenAndServe(addr, a.Router))
}



func (a *App) initializeFrontendRoutes() {

	a.Router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("client/build/static/"))))

	indexHandler := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "client/build/")
	}
	a.Router.PathPrefix("/").HandlerFunc(indexHandler)

}

func (a *App) initializeAuthRoutes() {
	authRouter := a.Router.PathPrefix("/auth").Subrouter()
	authRouter.HandleFunc("/jwt/request", a.authenticate)
	authRouter.HandleFunc("/jwt/validate", loginRequired(a.authTest))
}

func (a *App) initializeApiRoutes() {
	userRouter := a.APIRouter.PathPrefix("/users").Subrouter()
	userRouter.HandleFunc("", loginRequired(a.getUsers)).Methods("GET")
	userRouter.HandleFunc("", loginRequired(a.createUser)).Methods("POST")
	userRouter.HandleFunc("/{id:[0-9]+}", a.getUser).Methods("GET")
	userRouter.HandleFunc("/{id:[0-9]+}", loginRequired(a.updateUser)).Methods("PUT")
	userRouter.HandleFunc("/{id:[0-9]+}", loginRequired(a.deleteUser)).Methods("DELETE")

	postsRouter := a.APIRouter.PathPrefix("/posts").Subrouter()
	postsRouter.HandleFunc("", a.getPosts).Methods("GET")
	postsRouter.HandleFunc("", loginRequired(a.createPost)).Methods("POST")
	postsRouter.HandleFunc("/{id:[0-9]+}", a.getPost).Methods("GET")
	postsRouter.HandleFunc("/{id:[0-9]+}", loginRequired(a.updatePost)).Methods("PUT")
	postsRouter.HandleFunc("/{id:[0-9]+}", loginRequired(a.deletePost)).Methods("DELETE")

	managementRouter := a.APIRouter.PathPrefix("/manage").Subrouter()
	managementRouter.HandleFunc("/create", loginRequired(a.manageCreate)).Methods("POST")
	managementRouter.HandleFunc("/migrate", loginRequired(a.manageMigrate)).Methods("POST")
}

func (a *App) manageCreate(w http.ResponseWriter, r *http.Request) {
	a.DB.CreateTable(&User{})
	a.DB.CreateTable(&BlogPost{})
	respondWithJSON(w, http.StatusCreated, "DB Tables Created")
}

func (a *App) manageMigrate(w http.ResponseWriter, r *http.Request) {
	a.DB.AutoMigrate(&User{}, &BlogPost{})
	respondWithJSON(w, http.StatusCreated, "DB Tables Migrated")
}


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
		Email:unsafeUser.Email,
		PasswordHash:hashedPassword,
		FirstName:unsafeUser.FirstName,
		LastName:unsafeUser.LastName,
		IsAdmin:unsafeUser.IsAdmin,
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
		respondWithError(w, http.StatusBadRequest, "Invalid post request payload -- " + err.Error())
		return
	}

	respondWithJSON(w, http.StatusCreated, bp)
}

func (a *App) updatePost(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, http.StatusNotImplemented, "Not yet implemented")
}

func (a *App) deletePost(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, http.StatusNotImplemented, "Not yet implemented")
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
	blogPosts := getBlogPostListing(a.DB)
	respondWithJSON(w, http.StatusOK, blogPosts)
}


func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}
