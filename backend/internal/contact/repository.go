package contact

import (
	"errors"
	"fmt"

	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/pkg/log"

	"gorm.io/gorm"
)

type Repository interface {
	getContacts(userId uint) ([]contactResponse, error)
	contactExistsByID(id uint) error
	contactExists(name, email string) error
	createContact(userId uint, contact createContactDTO) error
	updateContact(userId, contactId uint, contact updateContactDTO) (*contactResponse, error)
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

func (r *repository) updateContact(userId, contactId uint, contact updateContactDTO) (*contactResponse, error) {
	fmt.Printf("%+v\n", contact)

	// NOTE:NOTE When update with struct, GORM will only update non-zero fields, you might want to use
	// map to update attributes or use Select to specify fields to update
	if err := r.db.Model(&entity.Contact{}).Where("id = ?", contactId).Updates(map[string]interface{}{
		"name":  contact.Name,
		"phone": contact.Phone,
		"email": contact.Email,
	}).Error; err != nil {
		return nil, err
	}

	var theContact contactResponse
	if err := r.db.Model(&entity.Contact{}).First(&theContact, contactId).Error; err != nil {
		return nil, err
	}

	return &theContact, nil
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

func (r *repository) contactExistsByID(id uint) error {
	var contact entity.Contact
	if err := r.db.Where("id = ?", id).First(&contact).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil // contact does not exist
		}
		return err
	}

	return nil // contact exists
}

func (r *repository) contactExists(name, email string) error {
	var contact entity.Contact
	if err := r.db.Where("name = ? OR email = ?", name, email).First(&contact).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil // contact does not exist
		}
		return err
	}

	return fmt.Errorf("name or email already taken")
}
