package transaction

import (
	"fmt"

	"github.com/emPeeGee/raffinance/pkg/log"
)

type Service interface {
	createTransaction(userId uint, transaction CreateTransactionDTO) (*transactionResponse, error)
	deleteTransaction(userId, id uint) error
	updateTransaction(usedId, transactionId uint, transaction UpdateTransactionDTO) (*transactionResponse, error)
	getTransactions(userId uint) ([]transactionResponse, error)
}

type service struct {
	repo   Repository
	logger log.Logger
}

func NewTransactionService(repo Repository, logger log.Logger) *service {
	return &service{repo: repo, logger: logger}
}

func (s *service) createTransaction(userId uint, transaction CreateTransactionDTO) (*transactionResponse, error) {
	ok, err := s.repo.accountExistsAndBelongsToUser(userId, transaction.ToAccountID)
	if err != nil || !ok {
		return nil, fmt.Errorf("toAccountId with id %d doesn't exist or belong to user", transaction.ToAccountID)
	}

	if transaction.TransactionTypeID == byte(TRANSFER) {
		ok, err := s.repo.accountExistsAndBelongsToUser(userId, *transaction.FromAccountID)
		if err != nil || !ok {
			return nil, fmt.Errorf("fromAccountId with id %d doesn't exist or belong to user", *transaction.FromAccountID)
		}
	}

	exists, err := s.repo.categoryExistsAndBelongsToUser(userId, transaction.CategoryID)
	if err != nil || !exists {
		return nil, fmt.Errorf("categoryId with id %d doesn't exist or belong to user", transaction.CategoryID)
	}

	exist, err := s.repo.tagsExistsAndBelongsToUser(userId, transaction.TagIDs)
	if err != nil || !exist {
		return nil, fmt.Errorf("not all tags belong to user or do not exist %v", transaction.TagIDs)
	}

	return s.repo.createTransaction(userId, transaction)
}

func (s *service) deleteTransaction(userId, id uint) error {
	ok, err := s.repo.transactionExistsAndBelongsToUser(userId, id)
	if err != nil {
		return err
	}

	if !ok {
		return fmt.Errorf("transaction with ID %d does not exist or belong to user with ID %d", id, userId)
	}

	return s.repo.deleteTransaction(userId, id)
}

func (s *service) getTransactions(userId uint) ([]transactionResponse, error) {
	return s.repo.getTransactions(userId)
}

func (s *service) updateTransaction(userId, transactionId uint, transaction UpdateTransactionDTO) (*transactionResponse, error) {
	exists, err := s.repo.transactionExistsAndBelongsToUser(userId, transactionId)
	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, fmt.Errorf("transaction with ID %d does not exist or belong to user with ID %d", transactionId, userId)
	}

	// TODO:  Duplicate in two places, here and create
	ok, err := s.repo.accountExistsAndBelongsToUser(userId, transaction.ToAccountID)
	if err != nil || !ok {
		return nil, fmt.Errorf("toAccountId with id %d doesn't exist or belong to user", transaction.ToAccountID)
	}

	if transaction.TransactionTypeID == byte(TRANSFER) {
		ok, err := s.repo.accountExistsAndBelongsToUser(userId, *transaction.FromAccountID)
		if err != nil || !ok {
			return nil, fmt.Errorf("fromAccountId with id %d doesn't exist or belong to user", *transaction.FromAccountID)
		}
	}

	exists, err = s.repo.categoryExistsAndBelongsToUser(userId, transaction.CategoryID)
	if err != nil || !exists {
		return nil, fmt.Errorf("categoryId with id %d doesn't exist or belong to user", transaction.CategoryID)
	}

	exist, err := s.repo.tagsExistsAndBelongsToUser(userId, transaction.TagIDs)
	if err != nil || !exist {
		return nil, fmt.Errorf("not all tags belong to user or do not exist %v", transaction.TagIDs)
	}

	return s.repo.updateTransaction(transactionId, transaction)
}
