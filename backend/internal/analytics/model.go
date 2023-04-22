package analytics

import (
	"errors"
	"time"
)

type TrendBalanceReport struct {
	Date    time.Time `json:"date"`
	Balance float64   `json:"balance"`
}

type TopTransactionsParams struct {
	*RangeDateParams
	Limit uint `form:"limit" binding:"required"`
}

type CategorySpending struct {
	CategoryName string  `json:"category"`
	Amount       float64 `json:"amount"`
}

type RangeDateParams struct {
	// TODO: make non required and default and then make requst withoud dates
	StartDate time.Time `form:"start_date" binding:"omitempty"`
	EndDate   time.Time `form:"end_date" binding:"omitempty"`
}

func validateRangeDate(params *RangeDateParams) error {
	if params.EndDate.Before(params.StartDate) {
		return errors.New("end date must be after start date")
	}
	return nil
}
