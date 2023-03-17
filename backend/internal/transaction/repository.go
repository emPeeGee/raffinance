package transaction

import (
	"github.com/emPeeGee/raffinance/pkg/log"
	"gorm.io/gorm"
)

type Repository interface {
	// getTransactions(userId uint) ([]transactionResponse, error)
	createTransaction(userId uint, Transaction CreateTransactionDTO) (*transactionResponse, error)
	// updateTransaction(userId, TransactionId uint, Transaction updateTransactionDTO) (*transactionResponse, error)
	// deleteTransaction(userId, id uint) error
	// TransactionExists(name string) (bool, error)
	// TransactionExistsAndBelongsToUser(userId, id uint) (bool, error)
}

type repository struct {
	db     *gorm.DB
	logger log.Logger
}

func NewTransactionRepository(db *gorm.DB, logger log.Logger) *repository {
	return &repository{db: db, logger: logger}
}

func (r *repository) createTransaction(userId uint, Transaction CreateTransactionDTO) (*transactionResponse, error) {
	// TODO: When transactions will be. Create a transaction with init balance
	// newTransaction := entity.Transaction{
	// 	ToAccountID: iin,

	// }

	// if err := r.db.Create(&newTransaction).Error; err != nil {
	// 	return nil, err
	// }

	// r.logger.Info("new Transaction, ", util.StringifyAny(newTransaction))
	createdTransaction := &transactionResponse{
		Amount: 0,
	}

	return createdTransaction, nil
}

// func (r *repository) updateTransaction(userId, TransactionId uint, Transaction updateTransactionDTO) (*TransactionResponse, error) {
// 	// NOTE: When update with struct, GORM will only update non-zero fields, you might want to use
// 	// map to update attributes or use Select to specify fields to update
// 	if err := r.db.Model(&entity.Transaction{}).Where("id = ?", TransactionId).Updates(map[string]interface{}{
// 		"name":     Transaction.Name,
// 		"currency": Transaction.Currency,
// 		"color":    Transaction.Color,
// 	}).Error; err != nil {
// 		return nil, err
// 	}

// 	// TODO: when transactions will be, on currency update should change all transaction currency
// 	// TODO: when transactions will be, on balance update should create new transaction

// 	var updatedTransaction TransactionResponse
// 	if err := r.db.Model(&entity.Transaction{}).First(&updatedTransaction, TransactionId).Error; err != nil {
// 		return nil, err
// 	}

// 	return &updatedTransaction, nil
// }

// // TODO: check when there will Transaction will contain transactions
// func (r *repository) deleteTransaction(userId, id uint) error {
// 	return r.db.Delete(&entity.Transaction{}, id).Error
// }

// func (r *repository) getTransactions(userId uint) ([]TransactionResponse, error) {
// 	var Transactions []TransactionResponse = make([]TransactionResponse, 0)
// 	var user entity.User

// 	if err := r.db.Preload("Transactions").Where("id = ?", userId).First(&user).Error; err != nil {
// 		return nil, err
// 	}

// 	r.logger.Debug(user)

// 	// TODO: TODO: TODO: Calculate the balance dynamically

// 	for _, Transaction := range user.Transactions {
// 		Transactions = append(Transactions, TransactionResponse{
// 			ID:        Transaction.ID,
// 			Name:      Transaction.Name,
// 			Currency:  Transaction.Currency,
// 			Balance:   0,
// 			Color:     Transaction.Color,
// 			CreatedAt: Transaction.CreatedAt,
// 			UpdatedAt: Transaction.UpdatedAt,
// 		})
// 	}

// 	// TODO: when empty sends nill, instead of []
// 	return Transactions, nil
// }

// func (r *repository) TransactionExistsAndBelongsToUser(userId, id uint) (bool, error) {
// 	var count int64

// 	if err := r.db.Model(&entity.Transaction{}).Where("id = ? AND user_id = ?", id, userId).Count(&count).Error; err != nil {
// 		return false, err
// 	}

// 	return count > 0, nil
// }

// func (r *repository) TransactionExists(name string) (bool, error) {
// 	var count int64

// 	if err := r.db.Model(&entity.Transaction{}).Where("name = ?", name).Count(&count).Error; err != nil {
// 		return false, err
// 	}

// 	return count > 0, nil
// }
