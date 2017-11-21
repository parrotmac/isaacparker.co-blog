package main

import (
	"errors"
	"github.com/jinzhu/gorm"
	"time"
)

type UnsafeUser struct {
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	IsAdmin   bool   `json:"isAdmin"`
	Password  string `json:"password"`
}

type User struct {
	gorm.Model
	Email        string `json:"email"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
	IsAdmin      bool   `json:"isAdmin"`
	PasswordHash []byte // This should never be used with JSON
}

type BlogPost struct {
	gorm.Model
	User        User      `gorm:"ForeignKey:UserID" json:"user"`
	UserID      int       `json:"userId"`
	IsPublished bool      `json:"isPublished"`
	Title       string    `json:"title"`
	Date        time.Time `json:"date"`
	Body        string    `sql:"type:text" json:"body"`
}

type PortfolioProject struct {
	gorm.Model
	Slug          string `json:"slug"` // Used if referenced in a url
	Title         string `json:"title"`
	CoverImageURL string `json:"coverImageURL"`
	ClientName    string `json:"clientName"`
	WriteupBody   string `sql:"type:text" json:"writeupBody"`
}

func (u *User) createUser(db *gorm.DB) error {
	created := db.NewRecord(u)
	db.Create(&u)
	if created {
		return nil
	}
	return errors.New("unable to create a user")
}

func (u *User) getUserUnsafe(db *gorm.DB) error {
	if err := db.First(&u, u.ID).Error; err != nil {
		return err
	}
	return nil
}

func (u *User) getUser(db *gorm.DB) error {
	err := db.First(&u, u.ID).Error
	u.PasswordHash = nil // Overwrite field `PasswordHash` with nil to prevent leakage
	if err != nil {
		return err
	}
	return nil
}

func (u *User) getUserByEmailUnsafe(db *gorm.DB) error {
	err := db.First(&u).Error
	if err != nil {
		return err
	}
	return nil
}

func (u *User) updateUser(db *gorm.DB) error {
	return errors.New("not implemented")
}

func (u *User) deleteUser(db *gorm.DB) error {
	return errors.New("not implemented")
}

func getUserListing(db *gorm.DB) []User {
	users := []User{}
	db.Find(&users)
	return users
}

func (b *BlogPost) createBlogPost(db *gorm.DB) error {
	created := db.NewRecord(b)
	db.Create(&b)
	if created {
		return nil
	}
	return errors.New("unable to create a blog post")
}

func (b *BlogPost) getBlogPost(db *gorm.DB, id uint) error {
	err := db.Find(&b, id).Error
	if err != nil {
		return err
	}
	return nil
}

func (b *BlogPost) updateBlogPost(db *gorm.DB) error {
	err := db.Save(&b).Error
	if err != nil {
		return err
	}
	return nil
}

func (b *BlogPost) deleteBlogPost(db *gorm.DB) error {
	db.Delete(&b)
	return nil
	//return errors.New("not implemented")
}

func getPublishedBlogPosts(db *gorm.DB) []BlogPost {
	blogPosts := []BlogPost{}
	//users := []User{}
	db.Preload("User").Order("created_at desc").Where("is_published = true").Find(&blogPosts)

	// Again, excluding PasswordHash as a best practice
	for i := range blogPosts {
		blogPosts[i].User.PasswordHash = nil
	}

	return blogPosts
}

func getAllBlogPosts(db *gorm.DB) []BlogPost {
	blogPosts := []BlogPost{}
	//users := []User{}
	db.Preload("User").Order("created_at desc").Find(&blogPosts)

	// Again, excluding PasswordHash as a best practice
	for i := range blogPosts {
		blogPosts[i].User.PasswordHash = nil
	}

	return blogPosts
}
