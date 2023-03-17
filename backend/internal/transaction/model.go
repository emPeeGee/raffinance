package transaction

import (
	"time"
)

type transactionResponse struct {
	ID          uint      `json:"id"`
	Currency    string    `json:"currency"`
	Date        time.Time `json:"date"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Location    string    `json:"location"`

	// TODO: Uncomment when category and tag are done
	// CategoryID uint `json:"categoryId" gorm:"notNull"`
	// TagID      uint `json:"tagId" gorm:"notNull"`

	FromAccountID     uint  `json:"fromAccountId"`
	ToAccountID       *uint `json:"toAccountId"`
	TransactionTypeID byte  `json:"transactionTypeId"`
}

type CreateTransactionDTO struct {
	Date        time.Time `json:"date" validate:"required"`
	Amount      float64   `json:"amount" validate:"required"`
	Description string    `json:"description" validate:"omitempty"`
	Location    string    `json:"location" validate:"omitempty,max=128"`

	// TODO: Uncomment when category and tag are done
	// CategoryID uint `json:"categoryId" gorm:"notNull"`
	// TagID      uint `json:"tagId" gorm:"notNull"`

	FromAccountID     *uint `json:"fromAccountId" validate:"omitempty,numeric"`
	ToAccountID       uint  `json:"toAccountId" validate:"numeric"`
	TransactionTypeID byte  `json:"transactionTypeId" validate:"numeric,transactiontype"`
}

type updateTransactionDTO struct {
	Name string `json:"name" validate:"required,min=2,max=256"`
	// TODO: Create new transaction for balance change
	Balance float64 `json:"balance" validate:"numeric"`
	// TODO: Change to all transactions
	Currency string `json:"currency" validate:"required,currency,min=2,max=10"`
	Color    string `json:"color" validate:"required,hexcolor,min=7,max=7"`
}
