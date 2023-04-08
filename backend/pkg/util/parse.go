package util

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
)

func ParseStringToUintArr(str string) ([]uint, error) {
	if str == "" {
		return nil, nil
	}

	strArr := strings.Split(str, ",")
	values := make([]uint, 0, len(strArr))
	for _, value := range strArr {
		tagID, err := strconv.ParseUint(value, 10, 32)
		if err != nil {
			return nil, fmt.Errorf("invalid string parameter")
		}
		values = append(values, uint(tagID))
	}

	return values, nil
}

func ParseStringToByte(valueStr string) (*byte, error) {
	if valueStr == "" {
		return nil, nil
	}

	value, err := strconv.ParseUint(valueStr, 10, 8)
	if err != nil {
		return nil, fmt.Errorf("invalid %s parameter: %w", valueStr, err)
	}

	b := byte(value)
	return &b, nil
}

func ParseMonthRange(startMonthStr, endMonthStr string) (*time.Time, *time.Time, error) {

	// both are required
	if startMonthStr == "" || endMonthStr == "" {
		return nil, nil, nil
	}

	startMonth, err := time.Parse("2006-01", startMonthStr)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid start_month parameter: %w", err)
	}

	endMonth, err := time.Parse("2006-01", endMonthStr)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid end_month parameter: %w", err)
	}

	if startMonth.After(endMonth) {
		return nil, nil, errors.New("start_month can be after end_month")
	}

	return &startMonth, &endMonth, nil
}
