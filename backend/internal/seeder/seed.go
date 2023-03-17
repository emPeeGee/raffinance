package seeder

import (
	"github.com/emPeeGee/raffinance/internal/entity"
	"github.com/emPeeGee/raffinance/internal/transaction"
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
	// Note: conversion to byte, I don't want to import this type in entity
	types := []entity.TransactionType{
		{ID: byte(transaction.INCOME), Name: "INCOME"},
		{ID: byte(transaction.EXPENSE), Name: "EXPENSE"},
		{ID: byte(transaction.TRANSFER), Name: "TRANSFER"},
	}

	for _, trType := range types {
		if err := s.db.FirstOrCreate(&trType).Error; err != nil {
			return err
		}

		s.logger.Infof("The %s was created", trType.Name)
	}

	return nil
}
