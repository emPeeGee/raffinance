package entity

type TransactionType struct {
	ID   uint   `json:"id" gorm:"primary_key"`
	Name string `json:"name" gorm:"notNull"`
}
