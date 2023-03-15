# Raffinance
## DB
Users (UserID, Username, Name, Email, Password, Phone, LatestLogins)
Contacts (ContactID, UserID, Name, Phone, Email)
Accounts (AccountID, UserID, Name, Currency) (Balance as a computed field)
Transactions (TransactionID, FromAccountID, ToAccountID, Date, Amount, Description, CategoryID, TagID, TransactionTypeID, Location, )
TransactionTypes (TransactionTypeID, Name)
Loans (LoanID, ContactID, AccountID, Amount, Date, RepaymentDate, Type, Status)
LoanPayments (PaymentID, LoanID, Date, Amount)
UserSettings (UserID, Currency, DateRange, Timezone, Theme, Language, NotificationPreference)
Categories (CategoryID, UserID, Name, Icon)
Tags (TagID, UserID, Name, Icon)
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
1. Account -> Transactions. Calculate the transactions dynamically when ready
1. Account, Contacts. Add comments on tricky code
1. Users.
  I. Latest logins. Display by aggregating them by day
  II. Limit latest logins by 50 

## Features
1. Transactions: compact view and more detailed view
2. Notifications:
3. Future: Exchanges. 
  1. When changing currency of account. Show it the user currency below to new one
4. 


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



It depends on the goals and priorities of your project. If you have a tight deadline or need to quickly demonstrate some functionality, it may be best to focus on one part of the stack first and then move to the other.

However, if you have the luxury of time and resources, it may be beneficial to work on both parts in parallel. This can help you identify any potential issues or roadblocks earlier in the development process, and allow you to make changes to the stack as a whole instead of having to refactor large portions of the application later on.

Regardless of which approach you take, it's important to continuously test and iterate on both the front-end and back-end components to ensure they work together seamlessly.