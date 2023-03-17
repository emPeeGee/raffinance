package category

import (
	"fmt"

	"github.com/emPeeGee/raffinance/pkg/log"
)

type Service interface {
	createCategory(userId uint, category createCategoryDTO) (*categoryResponse, error)
	deleteCategory(userId, id uint) error
	getCategories(userId uint) ([]categoryResponse, error)
	updateCategory(usedId, categoryId uint, category updateCategoryDTO) (*categoryResponse, error)
}

type service struct {
	repo   Repository
	logger log.Logger
}

func NewCategoryService(repo Repository, logger log.Logger) *service {
	return &service{repo: repo, logger: logger}
}

func (s *service) createCategory(userId uint, category createCategoryDTO) (*categoryResponse, error) {
	// name should be unique per user
	exists, err := s.repo.categoryExists(category.Name)
	if err != nil {
		return nil, err
	}

	if exists {
		return nil, fmt.Errorf("category with name %s exists", category.Name)
	}

	return s.repo.createCategory(userId, category)
}

func (s *service) deleteCategory(userId, id uint) error {
	ok, err := s.repo.categoryExistsAndBelongsToUser(userId, id)
	if err != nil {
		return err
	}

	if !ok {
		return fmt.Errorf("category with ID %d does not exist or belong to user with ID %d", id, userId)
	}

	return s.repo.deleteCategory(userId, id)
}

func (s *service) getCategories(userId uint) ([]categoryResponse, error) {
	return s.repo.getCategories(userId)
}

func (s *service) updateCategory(userId, categoryId uint, category updateCategoryDTO) (*categoryResponse, error) {
	exists, err := s.repo.categoryExistsAndBelongsToUser(userId, categoryId)
	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, fmt.Errorf("category with ID %d does not exist or belong to user with ID %d", categoryId, userId)
	}

	// check if such name exists, name should be unique per user
	exists, err = s.repo.categoryExists(category.Name)
	if err != nil {
		return nil, err
	}

	if exists {
		return nil, fmt.Errorf("category with name %s already exists", category.Name)
	}

	return s.repo.updateCategory(userId, categoryId, category)
}
