package contact

import "github.com/emPeeGee/raffinance/pkg/log"

type Service interface {
	createContact(userId uint, contact createContactDTO) error
	getContacts(userId uint) ([]contactResponse, error)
}

type service struct {
	repo   Repository
	logger log.Logger
}

func NewContactService(repo Repository, logger log.Logger) *service {
	return &service{repo: repo, logger: logger}
}

func (s *service) createContact(userId uint, contact createContactDTO) error {
	// TODO: check here, if the user have contact with name or email, per user.
	return s.repo.createContact(userId, contact)
}

func (s *service) getContacts(userId uint) ([]contactResponse, error) {
	return s.repo.getContacts(userId)
}
