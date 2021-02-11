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



Fields: 

- timestamp

- broker

- user_uuid

- asset_uuid

- operation: buy, sell

- amount

- price

- currency

- payload {}

   

## User's portfolio 

Created after each operation

