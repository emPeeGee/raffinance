package contact

import (
	"github.com/emPeeGee/raffinance/pkg/log"
)

type Service interface {
	createContact(userId uint, contact createContactDTO) error
	getContacts(userId uint) ([]contactResponse, error)
	updateContact(usedId, contactId uint, contact updateContactDTO) (*contactResponse, error)
}

type service struct {
	repo   Repository
	logger log.Logger
}

func NewContactService(repo Repository, logger log.Logger) *service {
	return &service{repo: repo, logger: logger}
}

func (s *service) createContact(userId uint, contact createContactDTO) error {
	// check if such name or email already exists, email and name should be unique per user
	err := s.repo.contactExists(contact.Name, contact.Email)
	if err != nil {
		return err
	}

	return s.repo.createContact(userId, contact)
}

func (s *service) getContacts(userId uint) ([]contactResponse, error) {
	return s.repo.getContacts(userId)
}

func (s *service) updateContact(usedId, contactId uint, contact updateContactDTO) (*contactResponse, error) {
	// TODO: check if the contact belongs to the current user

	// check if id exists
	err := s.repo.contactExistsByID(contactId)
	if err != nil {
		return nil, err
	}

	// check if such name or email already exists, email and name should be unique per user
	err = s.repo.contactExists(contact.Name, contact.Email)
	if err != nil {
		return nil, err
	}

	return s.repo.updateContact(usedId, contactId, contact)
}
