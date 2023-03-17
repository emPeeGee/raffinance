package tag

import (
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/pkg/log"
	"github.com/emPeeGee/raffinance/pkg/util"

	"gorm.io/gorm"
)

type Repository interface {
	getTags(userId uint) ([]tagResponse, error)
	createTag(userId uint, Tag createTagDTO) (*tagResponse, error)
	updateTag(userId, tagId uint, tag updateTagDTO) (*tagResponse, error)
	deleteTag(userId, id uint) error
	tagExists(name string) (bool, error)
	tagExistsAndBelongsToUser(userId, id uint) (bool, error)
}

type repository struct {
	db     *gorm.DB
	logger log.Logger
}

func NewTagRepository(db *gorm.DB, logger log.Logger) *repository {
	return &repository{db: db, logger: logger}
}

func (r *repository) createTag(userId uint, tag createTagDTO) (*tagResponse, error) {
	// TODO: When transactions will be. Create a transaction with init balance
	newTag := entity.Tag{
		Name:   tag.Name,
		Icon:   tag.Icon,
		Color:  tag.Color,
		UserID: &userId,
	}

	if err := r.db.Create(&newTag).Error; err != nil {
		return nil, err
	}

	r.logger.Info("new tag, ", util.StringifyAny(newTag))
	createdTag := &tagResponse{
		ID:        newTag.ID,
		Name:      newTag.Name,
		Color:     newTag.Color,
		Icon:      newTag.Icon,
		CreatedAt: newTag.CreatedAt,
		UpdatedAt: newTag.UpdatedAt,
	}

	return createdTag, nil
}

func (r *repository) updateTag(userId, tagId uint, tag updateTagDTO) (*tagResponse, error) {
	// NOTE: When update with struct, GORM will only update non-zero fields, you might want to use
	// map to update attributes or use Select to specify fields to update
	if err := r.db.Model(&entity.Tag{}).Where("id = ?", tagId).Updates(map[string]interface{}{
		"name":  tag.Name,
		"icon":  tag.Icon,
		"color": tag.Color,
	}).Error; err != nil {
		return nil, err
	}

	var updatedTag tagResponse
	if err := r.db.Model(&entity.Tag{}).First(&updatedTag, tagId).Error; err != nil {
		return nil, err
	}

	return &updatedTag, nil
}

// TODO: check when there will tag will contain transactions
func (r *repository) deleteTag(userId, id uint) error {
	return r.db.Delete(&entity.Tag{}, id).Error
}

func (r *repository) getTags(userId uint) ([]tagResponse, error) {
	var tags []tagResponse = make([]tagResponse, 0)
	var user entity.User

	if err := r.db.Preload("Tags").Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, err
	}

	r.logger.Info(user)

	for _, tag := range user.Tags {
		tags = append(tags, tagResponse{
			ID:        tag.ID,
			Name:      tag.Name,
			Color:     tag.Color,
			Icon:      tag.Icon,
			CreatedAt: tag.CreatedAt,
			UpdatedAt: tag.UpdatedAt,
		})
	}

	return tags, nil
}

func (r *repository) tagExistsAndBelongsToUser(userId, id uint) (bool, error) {
	var count int64

	if err := r.db.Model(&entity.Tag{}).Where("id = ? AND user_id = ?", id, userId).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *repository) tagExists(name string) (bool, error) {
	var count int64

	if err := r.db.Model(&entity.Tag{}).Where("name = ?", name).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}
