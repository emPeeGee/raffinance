package analytics

import (
	"time"

	"github.com/emPeeGee/raffinance/internal/transaction"
	"github.com/emPeeGee/raffinance/pkg/log"
)

type Service interface {
	GetTrendBalanceReport(userID uint, params *RangeDateParams) ([]TrendBalanceReport, error)
	GetTopTransactions(userID uint, params *TopTransactionsParams) ([]transaction.TransactionResponse, error)
}

type service struct {
	repo   Repository
	logger log.Logger
}

func NewAnalyticsService(repo Repository, logger log.Logger) *service {
	return &service{repo: repo, logger: logger}
}

func (s *service) GetTrendBalanceReport(userID uint, params *RangeDateParams) ([]TrendBalanceReport, error) {
	params.EndDate = params.EndDate.
		Truncate(24 * time.Hour).
		Add(time.Hour*23 + time.Minute*59 + time.Second*59 + time.Millisecond*999)

	return s.repo.GetTrendBalanceReport(userID, params)
}

func (s *service) GetTopTransactions(userID uint, params *TopTransactionsParams) ([]transaction.TransactionResponse, error) {
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
