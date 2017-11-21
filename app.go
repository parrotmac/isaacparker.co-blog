package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"net/http"
)

type App struct {
	Router    *mux.Router
	APIRouter *mux.Router
	DB        *gorm.DB
}

func (a *App) Initialize(hostname string, port int, user, password, dbname string) {
	connectionString :=
		fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", hostname, port, user, password, dbname)


	log.Print("[INIT] Opening database connection")
	var err error
	a.DB, err = gorm.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	if !a.DB.HasTable(&User{}) {
		a.DB.CreateTable(&User{})
		log.Print("[INIT] Created User table")
	}

	if !a.DB.HasTable(&BlogPost{}) {
		a.DB.CreateTable(&BlogPost{})
		log.Print("[INIT] Created BlogPost table")
	}

	if !a.DB.HasTable(&PortfolioProject{}) {
		a.DB.CreateTable(&PortfolioProject{})
		log.Print("[INIT] Created PortfolioProject table")
	}

	log.Print("[INIT] Running AutoMigrate on tables")
	a.DB.AutoMigrate(&User{})
	a.DB.AutoMigrate(&BlogPost{})
	a.DB.AutoMigrate(&PortfolioProject{})

	a.Router = mux.NewRouter()
	a.Router.StrictSlash(true)
	a.APIRouter = a.Router.PathPrefix("/api").Subrouter()

	log.Print("[INIT] Setting up routes")
	a.initializeApiRoutes()
	a.initializeAuthRoutes()
	a.initializeFrontendRoutes()

	log.Print("[INIT] Initialization complete")
}

func (a *App) Run(addr string) {

	log.Printf("Starting HTTP server at %v", addr)
	log.Fatal(http.ListenAndServe(addr, a.Router))
}

func (a *App) initializeFrontendRoutes() {

	staticUrlPrefix := "/static/"
	clientDirectoryPath := "client/build/static/"

	staticFileServer := http.FileServer(http.Dir(clientDirectoryPath))
	a.Router.PathPrefix(staticUrlPrefix).Handler(http.StripPrefix(staticUrlPrefix, staticFileServer))

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
	userRouter.HandleFunc("/{id:[0-9]+}", loginRequired(a.updateUser)).Methods("PATCH")
	userRouter.HandleFunc("/{id:[0-9]+}", loginRequired(a.deleteUser)).Methods("DELETE")

	postsRouter := a.APIRouter.PathPrefix("/posts").Subrouter()

	postsRouter.HandleFunc("", injectJWTClaims(a.getPosts)).Methods("GET")
	postsRouter.HandleFunc("", loginRequired(a.createPost)).Methods("POST")
	postsRouter.HandleFunc("/{id:[0-9]+}", injectJWTClaims(a.getPost)).Methods("GET")
	postsRouter.HandleFunc("/{id:[0-9]+}", loginRequired(a.updatePost)).Methods("PATCH")
	postsRouter.HandleFunc("/{id:[0-9]+}", loginRequired(a.deletePost)).Methods("DELETE")

}
