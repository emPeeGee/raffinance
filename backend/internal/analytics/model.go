package analytics

import (
	"time"

	"github.com/go-playground/validator"
)

type TrendBalanceReport struct {
	Date    time.Time `json:"date"`
	Balance float64   `json:"balance"`
}

type TopTransactionsParams struct {
	RangeDateParams
	Limit uint `form:"limit" binding:"required"`
}

type LabelValue struct {
	Label string  `json:"label"`
	Value float64 `json:"value"`
}

type Report struct {
	Title string `json:"title"`
	Data  any    `json:"data"`
}

type RangeDateParams struct {
	StartDate *time.Time `form:"start_date" binding:"omitempty"`
	EndDate   *time.Time `form:"end_date" binding:"omitempty,gtefield=StartDate"`
}

func ValidateDateRange(sl validator.StructLevel) {
	dateRange := sl.Current().Interface().(RangeDateParams)

	start := dateRange.StartDate != nil
	end := dateRange.EndDate != nil

	// Check if both fields are present or both fields are absent
	if (start && !end) || (!start && end) {
		sl.ReportError(end, "EndDate", "End Date", "End Date should be empty if Start Date is empty, and both should be present if one is present", "")
	}
}
