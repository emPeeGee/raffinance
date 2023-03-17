package transaction

import (
	"github.com/emPeeGee/raffinance/pkg/log"
)

type Service interface {
	createTransaction(userId uint, Transaction CreateTransactionDTO) (*transactionResponse, error)
	// deleteTransaction(userId, id uint) error
	// getTransactions(userId uint) ([]transactionResponse, error)
	// updateTransaction(usedId, TransactionId uint, Transaction updateTransactionDTO) (*transactionResponse, error)
}

type service struct {
	repo   Repository
	logger log.Logger
}

func NewTransactionService(repo Repository, logger log.Logger) *service {
	return &service{repo: repo, logger: logger}
}

func (s *service) createTransaction(userId uint, Transaction CreateTransactionDTO) (*transactionResponse, error) {
	return s.repo.createTransaction(userId, Transaction)
}

// func (s *service) deleteTransaction(userId, id uint) error {
// 	ok, err := s.repo.TransactionExistsAndBelongsToUser(userId, id)
// 	if err != nil {
// 		return err
// 	}

// 	if !ok {
// 		return fmt.Errorf("Transaction with ID %d does not exist or belong to user with ID %d", id, userId)
// 	}

// 	return s.repo.deleteTransaction(userId, id)
// }

// func (s *service) getTransactions(userId uint) ([]TransactionResponse, error) {
// 	return s.repo.getTransactions(userId)
// }

// func (s *service) updateTransaction(userId, TransactionId uint, Transaction updateTransactionDTO) (*TransactionResponse, error) {
// 	exists, err := s.repo.TransactionExistsAndBelongsToUser(userId, TransactionId)
// 	if err != nil {
// 		return nil, err
// 	}

// 	if !exists {
// 		return nil, fmt.Errorf("Transaction with ID %d does not exist or belong to user with ID %d", TransactionId, userId)
// 	}

// 	// check if such name exists, name should be unique per user
// 	exists, err = s.repo.TransactionExists(Transaction.Name)
// 	if err != nil {
// 		return nil, err
// 	}

// 	if exists {
// 		return nil, fmt.Errorf("Transaction with name %s already exists", Transaction.Name)
// 	}

// 	return s.repo.updateTransaction(userId, TransactionId, Transaction)
// }
