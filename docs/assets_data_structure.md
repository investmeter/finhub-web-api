# Assets DB



## All assets information table 

List of all available assets for adding to portfolio



Fields:

- uuid
- asset_type: sock, bond, currency, etf... 
- status: (available, archive)
- ticker
- title
- company
  - title
  - description
  - ... 
- brokers: Lisе
  - broker_slug
  - payload
    - {}
- ISIN



## User's assets operation

List of buying/selling operation for user

table: user_deals

Fields: 

- timestamp

- deal_timestamp

- user_id

- security_id

- operation: buy, sell

- amount

- price

- currency

- fee

- fee_currency

- comment

- payload {}

   

## User's portfolio 

Created after each operation

