package transaction

import (
	"time"

	"github.com/emPeeGee/raffinance/internal/category"
	"github.com/emPeeGee/raffinance/internal/tag"
	"github.com/go-playground/validator"
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name string `json:"name"`
}

type transactionResponse struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Date        time.Time `json:"date"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Location    string    `json:"location"`

	FromAccountID     *uint                          `json:"fromAccountId"`
	ToAccountID       uint                           `json:"toAccountId"`
	TransactionTypeID byte                           `json:"transactionTypeId"`
	Category          category.CategoryShortResponse `json:"category"`
	Tags              []tag.TagShortResponse         `json:"tags"`
}

type CreateTransactionDTO struct {
	Date        time.Time `json:"date" validate:"required"`
	Amount      float64   `json:"amount" validate:"required,gt=0"`
	Description string    `json:"description" validate:"omitempty"`
	Location    string    `json:"location" validate:"omitempty,max=128"`

	CategoryID uint `json:"categoryId" validate:"required,numeric"`
	// NOTE: valid order matters, unique can't be the last
	TagIDs []uint `json:"tagIds" validate:"omitempty,unique,dive,numeric,gt=0"`

	FromAccountID     *uint `json:"fromAccountId" validate:"omitempty,numeric"`
	ToAccountID       uint  `json:"toAccountId" validate:"required,numeric"`
	TransactionTypeID byte  `json:"transactionTypeId" validate:"numeric,transactiontype"`
}

type updateTransactionDTO struct {
	Date        time.Time `json:"date" validate:"required"`
	Amount      float64   `json:"amount" validate:"required,gt=0"`
	Description string    `json:"description" validate:"omitempty"`
	Location    string    `json:"location" validate:"omitempty,max=128"`

	// TODO: Uncomment when category and tag are done
	CategoryID uint `json:"categoryId" validate:"required,numeric"`
	// NOTE: valid order matters, unique can't be the last
	TagIDs []uint `json:"tagIds" validate:"omitempty,unique,dive,numeric,gt=0"`

	FromAccountID     *uint `json:"fromAccountId" validate:"omitempty,numeric"`
	ToAccountID       uint  `json:"toAccountId" validate:"required,numeric"`
	TransactionTypeID byte  `json:"transactionTypeId" validate:"numeric,transactiontype"`
}

func ValidateTransaction(sl validator.StructLevel) {
	txn := sl.Current().Interface().(CreateTransactionDTO)
	txnType := TransactionType(txn.TransactionTypeID)

	switch txnType {
	case EXPENSE, INCOME:
		{
			if txn.FromAccountID != nil {
				sl.ReportError(txn.FromAccountID, "fromAccount", "FromAccountID", "prohibited", "")
			}
		}
	case TRANSFER:
		{
			if txn.FromAccountID == nil {
				sl.ReportError(txn.FromAccountID, "fromAccount", "FromAccountID", "required", "")
			}
		}
	}

}
