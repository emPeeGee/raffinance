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

type RangeDateParams struct {
	StartDate time.Time `form:"start_date" binding:"required"`
	EndDate   time.Time `form:"end_date" binding:"required"`
}

func validateRangeDate(params *RangeDateParams) error {
	if params.EndDate.Before(params.StartDate) {
		return errors.New("end date must be after start date")
	}
	return nil
}
