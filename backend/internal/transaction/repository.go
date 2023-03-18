package transaction

import (
	"github.com/emPeeGee/raffinance/internal/category"
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/internal/tag"
	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/emPeeGee/raffinance/pkg/util"
	"gorm.io/gorm"
)

type Repository interface {
	getTransactions(userId uint) ([]transactionResponse, error)
	createTransaction(userId uint, Transaction CreateTransactionDTO) (*transactionResponse, error)
	// updateTransaction(userId, TransactionId uint, Transaction updateTransactionDTO) (*transactionResponse, error)
	// deleteTransaction(userId, id uint) error
	// TransactionExists(name string) (bool, error)
	// TransactionExistsAndBelongsToUser(userId, id uint) (bool, error)
	accountExistsAndBelongsToUser(userId, accountId uint) (bool, error)
	categoryExistsAndBelongsToUser(userId, categoryId uint) (bool, error)
	tagsExistsAndBelongsToUser(userId uint, tagsId []uint) (bool, error)
}

type repository struct {
	db     *gorm.DB
	logger log.Logger
}

func NewTransactionRepository(db *gorm.DB, logger log.Logger) *repository {
	return &repository{db: db, logger: logger}
}

func (r *repository) createTransaction(userId uint, transaction CreateTransactionDTO) (*transactionResponse, error) {
	newTransaction := entity.Transaction{
		Date:              transaction.Date,
		Amount:            transaction.Amount,
		Description:       transaction.Description,
		Location:          transaction.Location,
		ToAccountID:       transaction.ToAccountID,
		FromAccountID:     transaction.FromAccountID,
		CategoryID:        transaction.CategoryID,
		TransactionTypeID: transaction.TransactionTypeID,
	}

	// Associate tags with the transaction
	for _, tagID := range transaction.TagIDs {
		var tag entity.Tag
		if err := r.db.First(&tag, tagID).Error; err != nil {
			return nil, err
		}

		newTransaction.Tags = append(newTransaction.Tags, tag)
	}

	if err := r.db.Create(&newTransaction).Error; err != nil {
		return nil, err
	}

	r.logger.Info("new Transaction, ", util.StringifyAny(newTransaction))

	var createdTransaction *entity.Transaction
	if err := r.db.Preload("Tags").Preload("Category").First(&createdTransaction, newTransaction.ID).Error; err != nil {
		return nil, err
	}

	tr := entityToResponse(createdTransaction)

	return &tr, nil
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

// NOTE: Will be used in the dashboard
func (r *repository) getTransactions(userId uint) ([]transactionResponse, error) {
	var transactions []entity.Transaction

	if err := r.db.
		Model(&entity.Transaction{}).
		Joins("INNER JOIN accounts ON transactions.to_account_id = accounts.id").
		Where("accounts.user_id = ?", userId).
		Preload("Category").
		Preload("Tags").
		Order("date DESC").
		Find(&transactions).Error; err != nil {
		return nil, err
	}

	var trans []transactionResponse = make([]transactionResponse, 0)
	for _, transaction := range transactions {
		trans = append(trans, entityToResponse(&transaction))
	}

	return trans, nil
}

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

func (r *repository) accountExistsAndBelongsToUser(userId, accountId uint) (bool, error) {
	var count int64

	if err := r.db.Model(&entity.Account{}).Where("id = ? AND user_id = ?", accountId, userId).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *repository) categoryExistsAndBelongsToUser(userId, categoryId uint) (bool, error) {
	var count int64

	if err := r.db.Model(&entity.Category{}).Where("id = ? AND user_id = ?", categoryId, userId).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *repository) tagsExistsAndBelongsToUser(userId uint, tagIds []uint) (bool, error) {
	var count int64

	if err := r.db.Model(&entity.Tag{}).Where("id in ? AND user_id = ?", tagIds, userId).Count(&count).Error; err != nil {
		return false, err
	}

	r.logger.Infof("tags exist %d and length of tags %d", count, len(tagIds))
	return count == int64(len(tagIds)), nil
}

func entityToResponse(trx *entity.Transaction) transactionResponse {
	var tags []tag.TagShortResponse

	for _, trTag := range trx.Tags {
		tags = append(tags, tag.TagShortResponse{
			ID:    trTag.ID,
			Name:  trTag.Name,
			Color: trTag.Color,
			Icon:  trTag.Icon,
		})
	}

	transaction := transactionResponse{
		ID:          trx.ID,
		Description: trx.Description,
		Date:        trx.Date,
		Amount:      trx.Amount,
		Location:    trx.Location,
		CreatedAt:   trx.CreatedAt,
		UpdatedAt:   trx.UpdatedAt,

		ToAccountID:       trx.ToAccountID,
		FromAccountID:     trx.FromAccountID,
		TransactionTypeID: trx.TransactionTypeID,
		Tags:              tags,
		Category: category.CategoryShortResponse{
			ID:    trx.Category.ID,
			Name:  trx.Category.Name,
			Color: trx.Category.Color,
			Icon:  trx.Category.Icon,
		},
	}

	return transaction
}
