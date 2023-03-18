package transaction

import (
	"fmt"

	"github.com/emPeeGee/raffinance/internal/category"
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/internal/tag"
	"github.com/emPeeGee/raffinance/pkg/log"
	"gorm.io/gorm"
)

type Repository interface {
	getTransactions(userId uint) ([]transactionResponse, error)
	createTransaction(userId uint, transaction CreateTransactionDTO) (*transactionResponse, error)
	updateTransaction(transactionId uint, transaction UpdateTransactionDTO) (*transactionResponse, error)
	deleteTransaction(userId, id uint) error
	transactionExistsAndBelongsToUser(userId, id uint) (bool, error)
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

	var createdTransaction *entity.Transaction
	if err := r.db.Preload("Tags").
		Preload("Category").
		First(&createdTransaction, newTransaction.ID).Error; err != nil {
		return nil, err
	}

	tr := entityToResponse(createdTransaction)

	return &tr, nil
}

func (r *repository) updateTransaction(transactionId uint, transaction UpdateTransactionDTO) (*transactionResponse, error) {
	tx := r.db.Begin()

	if err := tx.Error; err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			return
		}
	}()

	// NOTE: When update with struct, GORM will only update non-zero fields, you might want to use
	// map to update attributes or use Select to specify fields to update
	if err := tx.Model(&entity.Transaction{}).
		Where("id = ?", transactionId).
		Updates(map[string]interface{}{
			"date":                transaction.Date,
			"amount":              transaction.Amount,
			"description":         transaction.Description,
			"location":            transaction.Location,
			"to_account_id":       transaction.ToAccountID,
			"from_account_id":     transaction.FromAccountID,
			"category_id":         transaction.CategoryID,
			"transaction_type_id": transaction.TransactionTypeID,
		}).Error; err != nil {
		return nil, err
	}

	var tr entity.Transaction
	if err := tx.First(&tr, transactionId).Error; err != nil {
		return nil, fmt.Errorf("failed to find transaction: %w", err)

	}

	var tags []entity.Tag
	if err := tx.Find(&tags, transaction.TagIDs).Error; err != nil {
		return nil, fmt.Errorf("failed to find tags: %w", err)
	}

	// Replace the tags associated with the transaction
	if err := tx.
		Model(&tr).
		Association("Tags").
		Replace(tags); err != nil {
		return nil, fmt.Errorf("failed to update transaction tags: %w", err)
	}

	if err := tx.
		Model(&entity.Transaction{}).
		Preload("Category").
		Preload("Tags").
		First(&tr, transactionId).Error; err != nil {
		return nil, fmt.Errorf("failed to load transaction after update: %w", err)
	}

	if err := tx.Commit().Error; err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	response := entityToResponse(&tr)
	return &response, nil
}

func (r *repository) deleteTransaction(userId, id uint) error {
	var transaction entity.Transaction

	if err := r.db.Preload("Tags").First(&transaction, id).Error; err != nil {
		return err
	}

	// Delete the transaction and its associated tags
	if err := r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&transaction).Association("Tags").Delete(&transaction.Tags); err != nil {
			return err
		}

		if err := tx.Delete(&transaction).Error; err != nil {
			return err
		}

		return nil
	}); err != nil {
		return err
	}

	return nil
}

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

func (r *repository) transactionExistsAndBelongsToUser(userId, id uint) (bool, error) {
	var count int64

	if err := r.db.
		Model(&entity.Transaction{}).
		Joins("INNER JOIN accounts ON transactions.to_account_id = accounts.id").
		Where("transactions.id = ? AND accounts.user_id = ?", id, userId).
		Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

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
