package category

import (
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/emPeeGee/raffinance/pkg/util"

	"gorm.io/gorm"
)

type Repository interface {
	getCategories(userId uint) ([]categoryResponse, error)
	createCategory(userId uint, category createCategoryDTO) (*categoryResponse, error)
	updateCategory(userId, categoryId uint, category updateCategoryDTO) (*categoryResponse, error)
	deleteCategory(userId, id uint) error
	categoryExists(name string) (bool, error)
	categoryExistsAndBelongsToUser(userId, id uint) (bool, error)
}

type repository struct {
	db     *gorm.DB
	logger log.Logger
}

func NewCategoryRepository(db *gorm.DB, logger log.Logger) *repository {
	return &repository{db: db, logger: logger}
}

func (r *repository) createCategory(userId uint, category createCategoryDTO) (*categoryResponse, error) {
	newCategory := entity.Category{
		Name:   category.Name,
		Color:  category.Color,
		Icon:   category.Icon,
		UserID: &userId,
	}

	if err := r.db.Create(&newCategory).Error; err != nil {
		return nil, err
	}

	r.logger.Info("new category, ", util.StringifyAny(newCategory))
	createdCategory := &categoryResponse{
		ID:        newCategory.ID,
		Name:      newCategory.Name,
		Color:     newCategory.Color,
		Icon:      newCategory.Color,
		CreatedAt: newCategory.CreatedAt,
		UpdatedAt: newCategory.UpdatedAt,
	}

	return createdCategory, nil
}

func (r *repository) updateCategory(userId, categoryId uint, category updateCategoryDTO) (*categoryResponse, error) {
	// NOTE: When update with struct, GORM will only update non-zero fields, you might want to use
	// map to update attributes or use Select to specify fields to update
	if err := r.db.Model(&entity.Category{}).Where("id = ?", categoryId).Updates(map[string]interface{}{
		"name":  category.Name,
		"color": category.Color,
		"icon":  category.Icon,
	}).Error; err != nil {
		return nil, err
	}

	var updatedCategory categoryResponse
	if err := r.db.Model(&entity.Category{}).First(&updatedCategory, categoryId).Error; err != nil {
		return nil, err
	}

	return &updatedCategory, nil
}

func (r *repository) deleteCategory(userId, id uint) error {
	return r.db.Delete(&entity.Category{}, id).Error
}

func (r *repository) getCategories(userId uint) ([]categoryResponse, error) {
	var categories []categoryResponse = make([]categoryResponse, 0)
	var user entity.User

	if err := r.db.Preload("Category").Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, err
	}

	r.logger.Debug(user)

	for _, category := range user.Category {
		categories = append(categories, categoryResponse{
			ID:        category.ID,
			Name:      category.Name,
			Color:     category.Color,
			Icon:      category.Icon,
			CreatedAt: category.CreatedAt,
			UpdatedAt: category.UpdatedAt,
		})
	}

	return categories, nil
}

func (r *repository) categoryExistsAndBelongsToUser(userId, id uint) (bool, error) {
	var count int64

	if err := r.db.Model(&entity.Category{}).Where("id = ? AND user_id = ?", id, userId).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *repository) categoryExists(name string) (bool, error) {
	var count int64

	if err := r.db.Model(&entity.Category{}).Where("name = ?", name).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}
