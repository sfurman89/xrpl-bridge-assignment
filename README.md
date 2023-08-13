## XRPL Bridge - Assignment

## Getting Project

```bash
$ git clone https://github.com/sfurman89/xrpl-bridge-assignment.git
$ cd xrpl-bridge-assignment
```

## Running the app

```bash
$ docker-compose up or docker-compose up -d
```

## Test

```bash
# Open your browser and run
$ http://localhost:3000/
```

## GraphQL APIs
```bash
# Running on testnet. Accounts and seeds can be used for testing. Copy/paste code to graphql playground
query GetWallet {
  getWallet(seed: "sEdSz4MVw1PkgHpTVfsP28LZp5eCY9V") {
    publicKey
    privateKey
    classicAddress
  }
}

query GetXrpBalance {
  getXrpBalance(account: "rUosT8RnA1nFpcZ2PncPpr17c69tnpsCkd")
}

query GetBalances {
  getBalances(account: "rUosT8RnA1nFpcZ2PncPpr17c69tnpsCkd") {
    value
    currency
    issuer
  }
}

query GetAccountInfo {
  getAccountInfo(input: {
    account: "rUosT8RnA1nFpcZ2PncPpr17c69tnpsCkd"
  }) {
    result {
      account_data {
        Account
        Balance
        Flags
        LedgerEntryType
        OwnerCount
        PreviousTxnID
        PreviousTxnLgrSeq
        Sequence
        index
      }
      account_flags {
        defaultRipple
        depositAuth
        disableMasterKey
        disallowIncomingCheck
        disallowIncomingNFTokenOffer
        disallowIncomingPayChan
        disallowIncomingTrustline
        disallowIncomingXRP
        globalFreeze
        noFreeze
        passwordSpent
        requireAuthorization
        requireDestinationTag
      }
      ledger_current_index
      validated
    }
    type
  }
}

query GetAccountCurrencies {
  getAccountCurrencies(input: {
    account: "rUosT8RnA1nFpcZ2PncPpr17c69tnpsCkd"
  }) {
    result {
      ledger_current_index
      receive_currencies
      send_currencies
      validated
    }
    type
  }
}

query GetAccountTransactions {
  getAccountTransactions(input: {
    account: "rUosT8RnA1nFpcZ2PncPpr17c69tnpsCkd"
  }) {
    result {
      account
      ledger_index_max
      ledger_index_min
      limit
      transactions {
        meta {
          TransactionIndex
          TransactionResult
        }
        tx {
          Account
          Amount
          Destination
          Fee
          LastLedgerSequence
          Sequence
          SigningPubKey
          TransactionType
          TxnSignature
          date
          hash
          ledger_index
        }
      }
    }
    type
  }
}

query GetTransaction {
  getTransaction(hash: "AF0736E3C6CEE21D2193EC4EEF17CF49B36F6BA259A9BDFBD207BF723436176A") {
    id
    result {
      Account
      Amount
      Destination
      Fee
      Flags
      LastLedgerSequence
      Sequence
      SigningPubKey
      TransactionType
      TxnSignature
      date
      hash
      inLedger
      ledger_index
      meta {
        TransactionIndex
        TransactionResult
        delivered_amount
      }
      validated
    }
    status
    type
  }
}

mutation CreateAccount {
  createAccount {
    wallet {
      publicKey
      privateKey
      classicAddress
      seed
    }
    balance
  }
}

mutation UpdateAccount {
  updateAccount(input: {
    seed: "sEdTXtN4zSxcKUVvUhMizdY2onZFJpZ",
    #LastLedgerSequence: 40323381
    Domain: "www.google.com",
    EmailHash: "simon.furman989@gmail.com",
  }) {
    id
    result {
      Account
      Fee
      Flags
      LastLedgerSequence
      Sequence
      SigningPubKey
      TransactionType
      TxnSignature
      Domain
      EmailHash
      MessageKey
      date
      hash
      inLedger
      ledger_index
      meta {
        TransactionIndex
        TransactionResult
      }
      validated
    }
    type
  }
}

mutation DeleteAccount {
  deleteAccount(input: {
    seed: "sEdTXtN4zSxcKUVvUhMizdY2onZFJpZ",
    destination: "rUosT8RnA1nFpcZ2PncPpr17c69tnpsCkd"
  }) {
    id
    result {
      Account
      Destination
      Fee
      LastLedgerSequence
      Sequence
      SigningPubKey
      TransactionType
      TxnSignature
      date
      hash
      inLedger
      ledger_index
      meta {
        TransactionIndex
        TransactionResult
        delivered_amount
      }
      validated
    }
    status
    type
  }
}

mutation SendXrp {
  sendXrp(input: {
    seed: "sEdSz4MVw1PkgHpTVfsP28LZp5eCY9V",
    destination: "rUosT8RnA1nFpcZ2PncPpr17c69tnpsCkd",
    amount: 10
  }) {
    id
    result{
      Account
      Amount
      Destination
      DestinationTag
      InvoiceID
      SendMax
      DeliverMin
      Fee
      Flags
      LastLedgerSequence
      Sequence
      SigningPubKey
      TransactionType
      TxnSignature
      date
      hash
      ledger_index
      meta {
        TransactionIndex
        TransactionResult
        delivered_amount
      }
    }
    type
  }
}

subscription MonitorTransactions {
  monitorTransactions(input: {
    wallets: ["rUosT8RnA1nFpcZ2PncPpr17c69tnpsCkd"]
  }) {
   transaction {
    account
    destination
    amount
    currency
    hash
    message
  }
    error
  }
}
```
