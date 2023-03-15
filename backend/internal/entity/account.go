package entity

import "gorm.io/gorm"

type Account struct {
	gorm.Model
	UserID *uint
	// TODO: Validation
	Name  string `json:"name" gorm:"notNull;size:256"`
	Color string `json:"color" gorm:"notNull;size:7"`
	// TODO: how will currency work
	Currency string `json:"currency" gorm:"notNull;size:10"`
}
