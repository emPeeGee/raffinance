# Raffinance
## DB
Users (UserID, Username, Name, Email, Password, Phone, LatestLogins)
Contacts (ContactID, UserID, Name, Phone, Email)
Accounts (AccountID, UserID, Name, Currency, Color) (Balance as a computed field)
Transactions (TransactionID, FromAccountID, ToAccountID, Date, Amount, Description, CategoryID, TagID, TransactionTypeID, Location, )
TransactionTypes (TransactionTypeID, Name)
TransactionTags (transactionID, tagID) (many to many)
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

## Todos
1. Never use float for money
1. Account -> Transactions. Calculate the transactions dynamically when ready
1. Account, Contacts. Add comments on tricky code
1. Users.
  I. Latest logins. Display by aggregating them by day
  II. Limit latest logins by 50 
1. Reports
1. The balance aggregated by tags, categories, period and so on...
1. [x] Creating/updating account with a balance.

1. You should push the necessary data over the websocket connection to update the balance and other related data in real-time
## Features
1. Transactions: compact view and more detailed view
2. Notifications:
3. Future: Exchanges. 
  1. When changing currency of account. Show it the user currency below to new one
  2.https://fixer.io 
4. Balance will be calculated dynamically. No need for table field.
5. Widgets in the dashboard which can be added by user
6. User can customize the font size and the content width as in orelly


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
User can choose which categories to show in dashboard

### RecurringTransactions
Transactions
------------
TransactionID (PK)
FromAccountID (FK)
ToAccountID (FK)
Date
Amount
Description
CategoryID (FK)
TagID (FK)
TransactionTypeID (FK)
Location
IsRecurring
RecurringTransactions
---------------------
RecurringTransactionID (PK)
TransactionID (FK)
StartDate
EndDate
Frequency


## Versioning
### Alpha
users, account, transactions, categories, tags, contacts | reports

#### Overall
Registration and Login: Users can register an account and log in with their email and password.

Dashboard: The dashboard is the first screen that the user sees after logging in. It should provide an overview of the user's financial situation, including their account balances, recent transactions, expenses, and income. This screen should also allow the user to quickly navigate to other areas of the app, such as transactions, accounts, and reports.

Transactions: This screen should display a list of all the user's transactions, sorted by date. The user should be able to filter transactions by date range, account, category, tag, and other criteria. Each transaction should show the transaction amount, description, category, and tags.

Accounts: This screen should display a list of all the user's accounts, along with their current balances. The user should be able to add, edit, and delete accounts, as well as transfer funds between accounts.

Categories and Tags: This screen should allow the user to add, edit, and delete categories and tags. The user should be able to assign categories and tags to transactions to help them track their spending.

Reports: This screen should provide the user with detailed reports of their financial activity, including income and expenses by category, spending trends over time, and account balances. The user should be able to customize the reports by date range, account, category, tag, and other criteria.


#### Dashboard
    {
      "totalBalance": 100,
      "accounts": [
        {
          "account_id": 1,
          "name": "Savings",
          "balance": 2500,
          "currency": "USD",
          "color": "#42a5f5"
        },
      ],
      "transactions": [
        {
          "transaction_id": 1,
          "from_account_id": 1,
          "to_account_id": null,
          "date": "2023-03-19",
          "amount": -300,
          "description": "Groceries",
          "category_id": 2,
          "tag_id": 1,
          "transaction_type_id": 1,
          "location": null
        },
        {
          "transaction_id": 2,
          "from_account_id": null,
          "to_account_id": 2,
          "date": "2023-03-18",
          "amount": 500,
          "description": "Paycheck",
          "category_id": 1,
          "tag_id": 2,
          "transaction_type_id": 2,
          "location": null
        }
      ],
      "income": 1500,
      "expenses": -700,
      "bills": [
        {
          "name": "Rent",
          "amount": -1000,
          "due_date": "2023-03-31"
        },
        {
          "name": "Utilities",
          "amount": -200,
          "due_date": "2023-03-25"
        }
      ]
    }

Dashboard:
The dashboard page should provide a quick and concise overview of the user's financial situation, giving them an instant snapshot of their account balances, recent transactions, expenses, and income. Here are some suggestions for how the dashboard page could be designed:

Account Balances: The dashboard should prominently display the user's account balances, showing the current balance for each account in a clear and easy-to-read format. The user should be able to click on an account to view more detailed information about the account, including transaction history, account details, and any associated tags or categories.

Recent Transactions: The dashboard should display a list of the user's most recent transactions, showing the date, description, category, and amount for each transaction. The user should be able to scroll through the list of transactions, and click on any transaction to view more detailed information about the transaction.

Expenses and Income: The dashboard should provide a clear breakdown of the user's expenses and income, showing the total amount spent and earned over a given time period (e.g. the current month or the past 30 days). The user should be able to drill down into the data to view more detailed information about their spending and income patterns.

Charts and Graphs: The dashboard could also include charts and graphs to help the user visualize their financial data. For example, a pie chart could show the breakdown of expenses by category, while a line graph could show spending trends over time. The user should be able to customize the charts and graphs based on their preferences and needs.

Notifications and Alerts: The dashboard could also display any notifications or alerts related to the user's accounts, such as low balance alerts or upcoming bill payments. The user should be able to customize the notifications and alerts based on their preferences and needs.



#### Proto
Financial Dashboard

Welcome back, [username]! Here's a summary of your financial information:

Total Balance: [total balance]
Income This Month: [income]
Expense This Month: [expense]

Overview:

[chart showing balance over time]

Upcoming Bills:

[bill 1 name] - [bill 1 due date] - [bill 1 amount]
[bill 2 name] - [bill 2 due date] - [bill 2 amount]
...

Recent Transactions:

[transaction 1 description] - [transaction 1 amount] - [transaction 1 date]
[transaction 2 description] - [transaction 2 amount] - [transaction 2 date]
...

#### Accounts
The accounts page should display a summary of all the user's accounts, showing the current balance, as well as any relevant details such as the account name, currency, and color.

Each account should be displayed as a separate card or panel, which the user can click on to view more detailed information about the account, such as a list of transactions, a chart of the account's balance over time, or the account's settings and preferences.

Depending on the design of the page, the user may also be able to perform various actions on each account, such as adding or editing transactions, transferring money between accounts, or adjusting the account's settings.

#### Transactions
The transactions page should display a list of all the user's transactions, with the most recent transactions appearing first. Each transaction should include relevant details such as the date, amount, description, category, tags, and account names. The page should also display a running balance of the user's accounts, which is updated in real-time as transactions are added or edited.

Depending on the design of the page, the user may be able to filter transactions based on various criteria such as date range, category, or tag. The user may also be able to edit or delete transactions directly from this page, as well as add new transactions.
Category and Tag Filters: The categories and tags page should provide filters to allow the user to view transactions by category or tag. The user should be able to select a category or tag from a dropdown menu, or search for a specific category or tag.

#### Reports
Category and Tag Reports: The categories and tags page should provide reports that show spending by category or tag over a given time period. The reports should be customizable, allowing the user to view spending by category or tag, and drill down into the data to view individual transactions.

#### Tags and Categories
Category Management: The categories page should allow the user to add, edit, and delete categories. Each category should have a name, color, and icon. The user should be able to assign transactions to categories, and view reports based on category spending.

Tag Management: The tags page should allow the user to add, edit, and delete tags. Each tag should have a name, color, and icon. The user should be able to assign transactions to tags, and view reports based on tag spending.

Category and Tag Suggestions: The categories and tags page should provide suggestions for new categories or tags based on the user's spending patterns. For example, if the user spends a lot of money on dining out, the app could suggest creating a "Restaurants" category.


If the user is on the tags page, they should see a list of all the tags that they have created, along with any relevant details such as the tag name, color, and icon. Depending on the design of the page, the user may also be able to edit or delete tags directly from this page.

In addition to the list of tags, the tags page may also include other features such as a search function to filter tags, sorting options to organize tags by name or usage frequency, or a section displaying statistics such as the total number of tags or the most frequently used tags.

### Beta 
Loans



### ???
Event-driven architecture: Instead of having services directly call each other, you can use events to communicate between services. When a service performs an action, it can publish an event describing what has happened. Other services can then subscribe to these events and perform their own actions accordingly. This approach can help to decouple services and make them more independent.
API gateway: An API gateway is a server that acts as an entry point for multiple microservices. The API gateway can handle incoming requests from clients and route them to the appropriate microservice. This approach can help to simplify client code, as it only needs to communicate with one endpoint (the API gateway) instead of multiple microservices.
Service mesh: A service mesh is a dedicated infrastructure layer for managing service-to-service communication within a microservices architecture. The service mesh provides features such as service discovery, load balancing, and traffic management, which can help to simplify service communication and make it more reliable.