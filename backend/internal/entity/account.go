package entity

import "gorm.io/gorm"

type Account struct {
	gorm.Model
	UserID *uint
	// TODO: Validation
	Name string `json:"name" gorm:"notNull;size:256"`
	// TODO: how will currency work
	Currency string `json:"currency" gorm:"notNull;size:10"`
}
