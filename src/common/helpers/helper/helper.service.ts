import { Injectable } from '@nestjs/common'
import { convertStringToHex, xrpToDrops } from 'xrpl'
import { MonitorTransactions } from '../../../resources/transaction/transaction.entity'
import { UpdateAccountInput } from '../../../resources/account/account.entity'
import { Md5 } from 'ts-md5'
import Big from 'big.js'
import crypto from 'crypto'

@Injectable()
export class HelperService {
  private _parseAffectedNodes(
    affectedNodes: any[],
    monitorTransactionPayload: MonitorTransactions
  ): MonitorTransactions {
    for (let i = 0; i < affectedNodes.length; i++) {
      if (affectedNodes[i].hasOwnProperty('ModifiedNode')) {
        const ledgerEntry = affectedNodes[i].ModifiedNode
        if (
          ledgerEntry.LedgerEntryType === 'AccountRoot' &&
          ledgerEntry.FinalFields.Account === monitorTransactionPayload.transaction.destination
        ) {
          const xrpAmount = new Big(ledgerEntry.FinalFields.Balance).minus(new Big(ledgerEntry.PreviousFields.Balance))
          if (xrpAmount.gte(0)) {
            return {
              ...monitorTransactionPayload,
              transaction: {
                ...monitorTransactionPayload.transaction,
                amount: xrpAmount.toString(),
                currency: 'XRP',
                message: 'Received'
              }
            }
          }
          return {
            ...monitorTransactionPayload,
            transaction: {
              ...monitorTransactionPayload.transaction,
              amount: xrpAmount.abs().toString(),
              currency: 'XRP',
              message: 'Received'
            }
          }
        }
      } else if (affectedNodes[i].hasOwnProperty('CreatedNode')) {
        const ledgerEntry = affectedNodes[i].CreatedNode
        if (
          ledgerEntry.LedgerEntryType === 'AccountRoot' &&
          ledgerEntry.NewFields.Account === monitorTransactionPayload.transaction.destination
        ) {
          return {
            ...monitorTransactionPayload,
            transaction: {
              ...monitorTransactionPayload.transaction,
              amount: new Big(ledgerEntry.NewFields.Balance).toString(),
              currency: 'XRP',
              message: 'Account funded'
            }
          }
        }
      }
    }
    return {
      ...monitorTransactionPayload,
      error: 'Did not find destination in affected nodes'
    }
  }

  parseTransactionResponse = (response: any): MonitorTransactions => {
    const monitorTransactionPayload: MonitorTransactions = {
      transaction: {
        account: response.transaction.Account,
        destination: response.transaction.Destination,
        hash: response.transaction.hash
      }
    }
    if (response.meta.TransactionResult !== 'tesSUCCESS') {
      return {
        ...monitorTransactionPayload,
        error: 'Transaction failed'
      }
    }
    if (response.transaction.TransactionType === 'Payment') {
      if (typeof response.meta.delivered_amount === 'string') {
        return {
          ...monitorTransactionPayload,
          transaction: {
            ...monitorTransactionPayload.transaction,
            amount: new Big(response.meta.delivered_amount).toString(),
            currency: 'XRP'
          }
        }
      }
      return {
        ...monitorTransactionPayload,
        error: 'Received non-XRP currency'
      }
    }
    if (
      ['PaymentChannelClaim', 'PaymentChannelFund', 'OfferCreate', 'CheckCash', 'EscrowFinish'].includes(
        response.transaction.TransactionType
      )
    ) {
      return this._parseAffectedNodes(response.meta.AffectedNodes, monitorTransactionPayload)
    }
    return {
      ...monitorTransactionPayload,
      error: `Not a currency-delivering transaction type (${response.transaction.TransactionType})`
    }
  }

  formatUpdateAccountParams = (params: UpdateAccountInput): UpdateAccountInput => {
    !params.Domain || (params.Domain = convertStringToHex(params.Domain.toLowerCase().trim()))
    !params.EmailHash || (params.EmailHash = Md5.hashStr(params.EmailHash.toLowerCase().trim()))
    !params.Fee || (params.Fee = xrpToDrops(params.Fee.trim()))
    !params.MessageKey ||
      (params.MessageKey = crypto.createHash('sha256').update(params.MessageKey, 'utf-8').digest('hex'))
    return params
  }
}
