package contact

import "time"

type contactResponse struct {
	ID        uint
	Name      string    `json:"name"`
	Phone     string    `json:"phone"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type createContactDTO struct {
	Name  string `json:"name" validate:"required,min=2,max=256"`
	Email string `json:"email" validate:"required,min=3,max=256"`
	Phone string `json:"phone" validate:"max=16"`
}

type updateContactDTO struct {
	ID    uint
	Name  string `json:"name" validate:"required,min=2,max=256"`
	Email string `json:"email" validate:"required,min=3,max=256"`
	Phone string `json:"phone" validate:"max=16"`
}
