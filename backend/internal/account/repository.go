package account

import (
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/pkg/log"

	"gorm.io/gorm"
)

type Repository interface {
	getAccounts(userId uint) ([]accountResponse, error)
	createAccount(userId uint, Account createAccountDTO) error
	updateAccount(userId, accountId uint, account updateAccountDTO) (*accountResponse, error)
	deleteAccount(userId, id uint) error
	accountExists(name string) (bool, error)
	accountExistsAndBelongsToUser(userId, id uint) (bool, error)
}

type repository struct {
	db     *gorm.DB
	logger log.Logger
}

func NewAccountRepository(db *gorm.DB, logger log.Logger) *repository {
	return &repository{db: db, logger: logger}
}

func (r *repository) createAccount(userId uint, account createAccountDTO) error {
	// TODO: When transactions will be. Create a transaction with init balance
	newAccount := entity.Account{
		Name:     account.Name,
		Currency: account.Currency,
		Color:    account.Color,
		UserID:   &userId,
	}

	if err := r.db.Create(&newAccount).Error; err != nil {
		return err
	}

	return nil
}

func (r *repository) updateAccount(userId, accountId uint, account updateAccountDTO) (*accountResponse, error) {
	// NOTE: When update with struct, GORM will only update non-zero fields, you might want to use
	// map to update attributes or use Select to specify fields to update
	if err := r.db.Model(&entity.Account{}).Where("id = ?", accountId).Updates(map[string]interface{}{
		"name":     account.Name,
		"currency": account.Currency,
		"color":    account.Color,
	}).Error; err != nil {
		return nil, err
	}

	// TODO: when transactions will be, on currency update should change all transaction currency
	// TODO: when transactions will be, on balance update should create new transaction

	var updatedAccount accountResponse
	if err := r.db.Model(&entity.Account{}).First(&updatedAccount, accountId).Error; err != nil {
		return nil, err
	}

	return &updatedAccount, nil
}

// TODO: check when there will account will contain transactions
func (r *repository) deleteAccount(userId, id uint) error {
	return r.db.Delete(&entity.Account{}, id).Error
}

func (r *repository) getAccounts(userId uint) ([]accountResponse, error) {
	var accounts []accountResponse = make([]accountResponse, 0)
	var user entity.User

	if err := r.db.Preload("Accounts").Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, err
	}

	r.logger.Debug(user)

	// TODO: TODO: TODO: Calculate the balance dynamically

	for _, account := range user.Accounts {
		accounts = append(accounts, accountResponse{
			ID:        account.ID,
			Name:      account.Name,
			Currency:  account.Currency,
			Balance:   0,
			Color:     account.Color,
			CreatedAt: account.CreatedAt,
			UpdatedAt: account.UpdatedAt,
		})
	}

	// TODO: when empty sends nill, instead of []
	return accounts, nil
}

func (r *repository) accountExistsAndBelongsToUser(userId, id uint) (bool, error) {
	var count int64

	if err := r.db.Model(&entity.Account{}).Where("id = ? AND user_id = ?", id, userId).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *repository) accountExists(name string) (bool, error) {
	var count int64

	if err := r.db.Model(&entity.Account{}).Where("name = ?", name).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}
