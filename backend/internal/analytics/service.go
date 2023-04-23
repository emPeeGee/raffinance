package analytics

import (
	"github.com/emPeeGee/raffinance/internal/transaction"
	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/emPeeGee/raffinance/pkg/util"
)

type Service interface {
	GetTrendBalanceReport(userID uint, params *RangeDateParams) ([]TrendBalanceReport, error)
	GetTopTransactions(userID uint, params *TopTransactionsParams) ([]transaction.TransactionResponse, error)
	GetCategoriesSpending(userID uint, params *RangeDateParams) ([]ByCategory, error)
	GetCategoriesIncome(userID uint, params *RangeDateParams) ([]ByCategory, error)
}

type service struct {
	repo   Repository
	logger log.Logger
}

func NewAnalyticsService(repo Repository, logger log.Logger) *service {
	return &service{repo: repo, logger: logger}
}

func (s *service) GetTrendBalanceReport(userID uint, params *RangeDateParams) ([]TrendBalanceReport, error) {
	if params.EndDate != nil && params.StartDate != nil {
		params.EndDate = util.EndOfTheDay(*params.EndDate)
	}

	return s.repo.GetTrendBalanceReport(userID, params)
}

func (s *service) GetTopTransactions(userID uint, params *TopTransactionsParams) ([]transaction.TransactionResponse, error) {
	if params.EndDate != nil && params.StartDate != nil {
		params.EndDate = util.EndOfTheDay(*params.EndDate)
	}

	transactions, err := s.repo.GetTopTransactions(userID, params)
	if err != nil {
		return nil, err
	}

	var topTxns []transaction.TransactionResponse
	for _, t := range transactions {
		topTxns = append(topTxns, transaction.EntityToResponse(&t))
	}

	return topTxns, nil
}

func (s *service) GetCategoriesSpending(userID uint, params *RangeDateParams) ([]ByCategory, error) {
	if params.EndDate != nil && params.StartDate != nil {
		params.EndDate = util.EndOfTheDay(*params.EndDate)
	}

	return s.repo.GetCategoriesReport(userID, transaction.EXPENSE, params)
}

func (s *service) GetCategoriesIncome(userID uint, params *RangeDateParams) ([]ByCategory, error) {
	if params.EndDate != nil && params.StartDate != nil {
		params.EndDate = util.EndOfTheDay(*params.EndDate)
	}

	return s.repo.GetCategoriesReport(userID, transaction.INCOME, params)
}
