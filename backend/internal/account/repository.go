package account

import (
	"errors"
	"fmt"

	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/internal/transaction"
	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/emPeeGee/raffinance/pkg/util"

	"gorm.io/gorm"
)

type Repository interface {
	getAccounts(userId uint) ([]accountResponse, error)
	createAccount(userId uint, Account createAccountDTO) (*accountResponse, error)
	updateAccount(userId, accountId uint, account updateAccountDTO) (*accountResponse, error)
	deleteAccount(userId, id uint) error
	accountExists(name string) (bool, error)
	accountExistsAndBelongsToUser(userId, id uint) (bool, error)
	accountIsUsed(accountId uint) error
	getAccountBalance(id uint) (float64, error)
	getUserBalance(userID uint) (float64, error)
}

type repository struct {
	db     *gorm.DB
	logger log.Logger
}

func NewAccountRepository(db *gorm.DB, logger log.Logger) *repository {
	return &repository{db: db, logger: logger}
}

func (r *repository) createAccount(userId uint, account createAccountDTO) (*accountResponse, error) {
	// TODO: When transactions will be. Create a transaction with init balance
	newAccount := entity.Account{
		Name:     account.Name,
		Currency: account.Currency,
		Color:    account.Color,
		UserID:   &userId,
	}

	if err := r.db.Create(&newAccount).Error; err != nil {
		return nil, err
	}

	r.logger.Info("new account, ", util.StringifyAny(newAccount))
	createdAccount := &accountResponse{
		ID:        newAccount.ID,
		Name:      newAccount.Name,
		Currency:  newAccount.Currency,
		Color:     newAccount.Color,
		Balance:   account.Balance,
		CreatedAt: newAccount.CreatedAt,
		UpdatedAt: newAccount.UpdatedAt,
	}

	return createdAccount, nil
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

	// Calculating the balance dynamically
	accountBalance, err := r.getAccountBalance(accountId)
	if err != nil {
		return nil, err
	}

	updatedAccount.Balance = accountBalance

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

	for _, account := range user.Accounts {
		// TODO: get the account balance dynamically. Is there better way for it?
		accountBalance, err := r.getAccountBalance(account.ID)
		if err != nil {
			return []accountResponse{}, nil
		}

		accounts = append(accounts, accountResponse{
			ID:        account.ID,
			Name:      account.Name,
			Currency:  account.Currency,
			Balance:   accountBalance,
			Color:     account.Color,
			CreatedAt: account.CreatedAt,
			UpdatedAt: account.UpdatedAt,
		})
	}

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

// TODO: Can this be achieved using constraints ???
func (r *repository) accountIsUsed(accountId uint) error {
	var count int64

	r.db.Model(&entity.Transaction{}).
		Where("from_account_id = ? OR to_account_id = ?", accountId, accountId).
		Count(&count)

	if count > 0 {
		return fmt.Errorf("cannot delete account with ID %d because it is used by %d transactions", accountId, count)
	}

	return nil
}

func (r *repository) getAccountBalance(id uint) (float64, error) {
	// Calculate the total balance of this account
	var balanceExcludingTransfers, transfersTotal float64
	err := r.db.Transaction(func(tx *gorm.DB) error {
		// Calculate the non-transfer total balance
		err := tx.Table("transactions").
			Where("deleted_at is null and to_account_id = ? and transaction_type_id <> ?", id, transaction.TRANSFER).
			Select("COALESCE(SUM(CASE WHEN transaction_type_id = ? THEN amount ELSE -amount END), 0)", transaction.INCOME).
			Row().
			Scan(&balanceExcludingTransfers)
		if err != nil {
			return err
		}

		// Calculate the transfer total balance
		err = tx.Table("transactions").
			Where("deleted_at is null and (to_account_id = ? or from_account_id = ?) and transaction_type_id = ?", id, id, transaction.TRANSFER).
			Select("COALESCE(SUM(CASE WHEN to_account_id = ? THEN amount ELSE -amount END), 0)", id).
			Row().
			Scan(&transfersTotal)
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, errors.New("account balance not found")
		}

		return 0, err
	}

	r.logger.Infof("Account %d balance: balance excluding transfers %f, transfer total %f", id, balanceExcludingTransfers, transfersTotal)

	return balanceExcludingTransfers + transfersTotal, nil
}

func (r *repository) getUserBalance(userID uint) (float64, error) {
	var totalBalance float64

	// Retrieve all accounts associated with the user
	var accounts []entity.Account
	if err := r.db.Where("user_id = ?", userID).Find(&accounts).Error; err != nil {
		return 0, err
	}

	// Iterate over each account to calculate the total balance
	for _, account := range accounts {
		accountBalance, err := r.getAccountBalance(account.ID)
		if err != nil {
			return 0, err
		}

		totalBalance += accountBalance
	}

	r.logger.Infof("User %d balance: %f", userID, totalBalance)

	return totalBalance, nil
}
