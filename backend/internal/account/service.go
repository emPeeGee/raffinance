package account

import (
	"fmt"

	"github.com/emPeeGee/raffinance/pkg/log"
)

type Service interface {
	createAccount(userId uint, account createAccountDTO) (*accountResponse, error)
	deleteAccount(userId, id uint) error
	getAccounts(userId uint) ([]accountResponse, error)
	updateAccount(usedId, accountId uint, account updateAccountDTO) (*accountResponse, error)
}

type service struct {
	repo   Repository
	logger log.Logger
}

func NewAccountService(repo Repository, logger log.Logger) *service {
	return &service{repo: repo, logger: logger}
}

func (s *service) createAccount(userId uint, account createAccountDTO) (*accountResponse, error) {
	// check if such name or email already exists, email and name should be unique per user
	exists, err := s.repo.accountExists(account.Name)
	if err != nil {
		return nil, err
	}

	if exists {
		return nil, fmt.Errorf("account with name %s exists", account.Name)
	}

	return s.repo.createAccount(userId, account)
}

func (s *service) deleteAccount(userId, id uint) error {
	ok, err := s.repo.accountExistsAndBelongsToUser(userId, id)
	if err != nil {
		return err
	}

	if !ok {
		return fmt.Errorf("account with ID %d does not exist or belong to user with ID %d", id, userId)
	}

	return s.repo.deleteAccount(userId, id)
}

func (s *service) getAccounts(userId uint) ([]accountResponse, error) {
	return s.repo.getAccounts(userId)
}

func (s *service) updateAccount(userId, accountId uint, account updateAccountDTO) (*accountResponse, error) {
	exists, err := s.repo.accountExistsAndBelongsToUser(userId, accountId)
	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, fmt.Errorf("account with ID %d does not exist or belong to user with ID %d", accountId, userId)
	}

	// check if such name exists, name should be unique per user
	exists, err = s.repo.accountExists(account.Name)
	if err != nil {
		return nil, err
	}

	if exists {
		return nil, fmt.Errorf("account with name %s already exists", account.Name)
	}

	return s.repo.updateAccount(userId, accountId, account)
}
