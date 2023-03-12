package contact

import (
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/pkg/log"

	"gorm.io/gorm"
)

type Repository interface {
	getContacts(userId uint) ([]contactResponse, error)
	createContact(userId uint, contact createContactDTO) error
	// updateContact(contact updateContactDTO) (contactResponse, error)
	// deleteContact(id uint) error
}

type repository struct {
	db     *gorm.DB
	logger log.Logger
}

func NewContactRepository(db *gorm.DB, logger log.Logger) *repository {
	return &repository{db: db, logger: logger}
}

func (r *repository) createContact(userId uint, contact createContactDTO) error {
	newContact := entity.Contact{
		Name:   contact.Name,
		Email:  contact.Email,
		Phone:  contact.Phone,
		UserID: &userId,
	}

	if err := r.db.Create(&newContact).Error; err != nil {
		return err
	}

	return nil
}

func (r *repository) getContacts(userId uint) ([]contactResponse, error) {
	var contacts []contactResponse
	var user entity.User

	if err := r.db.Preload("Contacts").Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, err
	}

	r.logger.Debug(user)

	for _, contact := range user.Contacts {
		contacts = append(contacts, contactResponse{
			ID:    contact.ID,
			Name:  contact.Name,
			Email: contact.Email,
			Phone: contact.Phone,
		})
	}

	// TODO: when empty sends nill, instead of []
	return contacts, nil
	// var contacts []contactResponse
	// var user entity.User

	// if err := r.db.Model(&user).Where("id = ?", userId).First(&user).Error; err != nil {
	// 	return nil, err
	// }

	// if err := r.db.Model(&user).Association("Contacts").Find(&contacts); err != nil {
	// 	return nil, err
	// }

	// return contacts, nil
}
