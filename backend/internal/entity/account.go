package entity

import "gorm.io/gorm"

type Account struct {
	gorm.Model
	UserID *uint
	// TODO: Validation
	Name    string  `json:"name" gorm:"notNull;unique;size:256"`
	Balance float32 `json:"balance" gorm:"notNull"`
	// TODO: how will currency work
	Currency string `json:"currency" gorm:"notNull;size:10"`
}
