# Raffinance
## DB
Users (UserID, Username, Name, Email, Password, Phone, LatestLogins)
Contacts (ContactID, UserID, Name, Phone, Email)
Accounts (AccountID, UserID, Name, Currency, Color) (Balance as a computed field)
Transactions (TransactionID, FromAccountID, ToAccountID, Date, Amount, Description, CategoryID, TagID, TransactionTypeID, Location, )
TransactionTypes (TransactionTypeID, Name)
Transaction_tags (transactionID, tagID) (many to many)
Loans (LoanID, ContactID, AccountID, Amount, Date, RepaymentDate, Type, Status)
LoanPayments (PaymentID, LoanID, Date, Amount)
UserSettings (UserID, Currency, DateRange, Timezone, Theme, Language, NotificationPreference)
Categories (CategoryID, UserID, Name, Color, Icon)
Tags (TagID, UserID, Name, Color, Icon)
Notifications (NotificationID, UserID, Title, Description, Date, IsRead)
RecurringTransactions (RecurringTransactionID, UserID, AccountID, StartDate, EndDate, Amount, Type, Description, CategoryID, TransactionTypeID, Frequency, FrequencyInterval)
Goals (GoalID, UserID, Name, Amount, StartDate, EndDate, Description, Status(whether the goal is ongoing, achieved, or failed)))

### Possibly attributes
Contacts: ContactType (for example, individual or company), Website, Notes
Loans: PaymentFrequency (for example, monthly or bi-weekly), InterestType (for example, fixed or variable), OriginationFee
LoanPayments: Balance (to track the remaining balance on the loan), InterestBalance (to track the remaining interest on the loan)
Notifications: Priority (for example, High, Medium, or Low) 
Goals: Progress (to track how much progress the user has made towards achieving the goal)
Goals: Status (for tracking whether the goal is ongoing, achieved, or failed)
Users: ProfilePicture
Transactions: PaymentMethod, Location, Image, Receipt
Loans: InterestRate, DurationInMonths, GracePeriodInMonths

## TODOs
1. Never use float for money
1. Account -> Transactions. Calculate the transactions dynamically when ready
1. Account, Contacts. Add comments on tricky code
1. Users.
  I. Latest logins. Display by aggregating them by day
  II. Limit latest logins by 50 
1. Reports
1. The balance aggregated by tags, categories, period and so on...

## Features
1. Transactions: compact view and more detailed view
2. Notifications:
3. Future: Exchanges. 
  1. When changing currency of account. Show it the user currency below to new one
  2.https://fixer.io 
4.  Balance will be calculated dynamically. No need for table field.


## Backend structure
- cmd/server/
  - main.go
- internal/
  - config/
    - config.go
  - feature1/
    - handler.go
    - service.go
    - repo.go
  - entity/
    - user.go
  - pkg/
- migrations/
  - migration_1.go
  - migration_2.go


## Thoughts
How the latest data will be send ? Long polling or a websocket?

## Versioning
### Alpha
users, account, transactions, categories, tags, contacts | reports
### Beta 
Loans