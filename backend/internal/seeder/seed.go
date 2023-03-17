package seeder

import (
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/pkg/log"
	"gorm.io/gorm"
)

type Seeder interface {
	Run() error
}

type seeder struct {
	db     *gorm.DB
	logger log.Logger
}

func NewSeeder(db *gorm.DB, logger log.Logger) *seeder {
	return &seeder{db: db, logger: logger}
}

func (s *seeder) Run() error {
	s.logger.Info("Start the seeding process")

	if err := s.seedTransactionTypes(); err != nil {
		return err
	}

	s.logger.Info("The seeding has been finished")
	return nil
}

func (s *seeder) seedTransactionTypes() error {
	types := []entity.TransactionType{
		{ID: 1, Name: "INCOME"},
		{ID: 2, Name: "EXPENSE"},
		{ID: 3, Name: "TRANSFER"},
	}

	for _, trType := range types {
		if err := s.db.FirstOrCreate(&trType).Error; err != nil {
			return err
		}

		s.logger.Infof("The %s was created", trType.Name)
	}

	return nil
}
