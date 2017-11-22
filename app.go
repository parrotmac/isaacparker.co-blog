package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"net/http"
)

type DBConnectionInfo struct {
	hostname	string
	name 		string
	port 		int
	username	string
	password	string
}

type App struct {
	Router    	*mux.Router
	APIRouter 	*mux.Router
	DB        	*gorm.DB
	jwtKey[]	byte
}

func (a *App) Initialize(dbInfo DBConnectionInfo) {
	connectionString := fmt.Sprintf(
			"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
				dbInfo.hostname,
					dbInfo.port,
						dbInfo.username,
							dbInfo.password,
								dbInfo.name)


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
	authRouter.HandleFunc("/jwt/validate", a.loginRequired(a.authTest))

}

func (a *App) initializeApiRoutes() {

	userRouter := a.APIRouter.PathPrefix("/users").Subrouter()

	userRouter.HandleFunc("", a.loginRequired(a.getUsers)).Methods("GET")
	userRouter.HandleFunc("", a.loginRequired(a.createUser)).Methods("POST")
	userRouter.HandleFunc("/{id:[0-9]+}", a.getUser).Methods("GET")
	userRouter.HandleFunc("/{id:[0-9]+}", a.loginRequired(a.updateUser)).Methods("PATCH")
	userRouter.HandleFunc("/{id:[0-9]+}", a.loginRequired(a.deleteUser)).Methods("DELETE")

	postsRouter := a.APIRouter.PathPrefix("/posts").Subrouter()

	postsRouter.HandleFunc("", a.getPosts).Methods("GET")
	postsRouter.HandleFunc("", a.loginRequired(a.createPost)).Methods("POST")
	postsRouter.HandleFunc("/{id:[0-9]+}", a.getPost).Methods("GET")
	postsRouter.HandleFunc("/{id:[0-9]+}", a.loginRequired(a.updatePost)).Methods("PATCH")
	postsRouter.HandleFunc("/{id:[0-9]+}", a.loginRequired(a.deletePost)).Methods("DELETE")

}
