package account

import "time"

type accountResponse struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Currency  string    `json:"currency"`
	Balance   float64   `json:"balance" gorm:"-"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type createAccountDTO struct {
	Name string `json:"name" validate:"required,min=2,max=256"`
	// Balance  float64 `json:"balance" validate:"required,numeric"`
	Currency string `json:"currency" validate:"required,min=2,max=10"`
}

type updateAccountDTO struct {
	Name string `json:"name" validate:"required,min=2,max=256"`
	// TODO: Create new transaction for balance change
	Balance float64 `json:"balance" validate:"numeric"`
	// TODO: Change to all transactions
	Currency string `json:"currency" validate:"min=2,max=10"`
}
