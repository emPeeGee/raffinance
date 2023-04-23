package analytics

import (
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/internal/transaction"
	"github.com/emPeeGee/raffinance/pkg/log"
	"gorm.io/gorm"
)

type Repository interface {
	GetTrendBalanceReport(userID uint, params *RangeDateParams) ([]TrendBalanceReport, error)
	GetTopTransactions(userID uint, params *TopTransactionsParams) ([]entity.Transaction, error)
	GetCategoriesReport(userID uint, txnType transaction.TransactionType, params *RangeDateParams) ([]ByCategory, error)
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

	query := r.db.Table("transactions").
		Select("date::date AS date, SUM(CASE WHEN transactions.transaction_type_id = 1 THEN transactions.amount ELSE -transactions.amount END) AS balance").
		Joins("JOIN accounts ON transactions.to_account_id = accounts.id").
		Where("transactions.deleted_at IS NULL AND accounts.user_id = ?", userID).
		Group("date::date").
		Order("date::date ASC")

	if params.StartDate != nil && params.EndDate != nil {
		query.Where("date BETWEEN ? AND ?", params.StartDate, params.EndDate)
	}

	if err := query.Scan(&trends).Error; err != nil {
		return nil, err
	}

	return trends, nil
}

func (r *repository) GetTopTransactions(userID uint, params *TopTransactionsParams) ([]entity.Transaction, error) {
	var transactions []entity.Transaction

	query := r.db.Table("transactions").
		Preload("Tags").
		Preload("Category").
		Joins("JOIN accounts ON transactions.from_account_id = accounts.id OR transactions.to_account_id = accounts.id").
		Where("transactions.deleted_at IS NULL AND accounts.user_id = ?", userID).
		Order("amount DESC").
		Limit(int(params.Limit))

	if params.StartDate != nil && params.EndDate != nil {
		query.Where("date BETWEEN ? AND ?", params.StartDate, params.EndDate)
	}

	if err := query.Scan(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}

func (r *repository) GetCategoriesReport(userID uint, txnType transaction.TransactionType, params *RangeDateParams) ([]ByCategory, error) {
	var byCategory []ByCategory

	// Query the category-wise spending data for the user within the specified date range
	query := r.db.Table("transactions").
		Joins("JOIN categories ON categories.id = transactions.category_id").
		Joins("JOIN accounts ON transactions.from_account_id = accounts.id OR transactions.to_account_id = accounts.id").
		Select("categories.name AS category_name, SUM(transactions.amount) AS amount").
		Where("accounts.user_id = ? AND transactions.transaction_type_id = ?", userID, txnType).
		Where("transactions.deleted_at IS NULL AND categories.deleted_at IS NULL").
		Group("categories.name")

	if params.StartDate != nil && params.EndDate != nil {
		query.Where("date BETWEEN ? AND ?", params.StartDate, params.EndDate)
	}

	err := query.Scan(&byCategory).Error
	if err != nil {
		return nil, err
	}

	return byCategory, nil
}
