package entity

import (
	"time"

	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	FromAccountID *uint `json:"fromAccountID" gorm:"foreignkey:accountId"`
	ToAccountID   *uint `json:"toAccountID" gorm:"foreignkey:accountId;notNull"`

	Date        time.Time `json:"date" gorm:"notNull"`
	Amount      float64   `json:"amount" gorm:"notNull"`
	Description string    `json:"description"`
	Location    string    `json:"location" gorm:"size:128"`

	// TODO: Uncomment when category and tag are done
	// CategoryID uint `json:"categoryId" gorm:"notNull"`
	// TagID      uint `json:"tagId" gorm:"notNull"`

	TransactionTypeID *uint `json:"transactionTypeID"`
	// TransactionType   TransactionType `gorm:"foreignKey:TransactionTypeID"`
}
