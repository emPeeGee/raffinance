package analytics

import (
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/pkg/log"
	"gorm.io/gorm"
)

type Repository interface {
	GetTrendBalanceReport(userID uint, params *RangeDateParams) ([]TrendBalanceReport, error)
	GetTopTransactions(userID uint, params *TopTransactionsParams) ([]entity.Transaction, error)
}

type repository struct {
	db     *gorm.DB
	logger log.Logger
}

func NewAnalyticsRepository(db *gorm.DB, logger log.Logger) *repository {
	return &repository{db: db, logger: logger}
}

func (r *repository) GetTrendBalanceReport(userID uint, params *RangeDateParams) ([]TrendBalanceReport, error) {
	var trends []TrendBalanceReport

	err := r.db.Table("transactions").
		Select("date::date AS date, SUM(CASE WHEN transactions.transaction_type_id = 1 THEN transactions.amount ELSE -transactions.amount END) AS balance").
		Joins("JOIN accounts ON transactions.to_account_id = accounts.id").
		Where("accounts.user_id = ? AND date BETWEEN ? AND ?", userID, params.StartDate, params.EndDate).
		Group("date::date").
		Order("date::date ASC").
		Scan(&trends).Error

	if err != nil {
		return nil, err
	}

	return trends, nil
}

func (r *repository) GetTopTransactions(userID uint, params *TopTransactionsParams) ([]entity.Transaction, error) {
	var transactions []entity.Transaction

	err := r.db.Table("transactions").
		Preload("Tags").
		Preload("Category").
		Joins("JOIN accounts ON transactions.from_account_id = accounts.id OR transactions.to_account_id = accounts.id").
		Where("accounts.user_id = ? AND date BETWEEN ? AND ?", userID, params.StartDate, params.EndDate).
		Order("amount DESC").
		Limit(int(params.Limit)).
		Find(&transactions).Error

	if err != nil {
		return nil, err
	}

	return transactions, nil
}
