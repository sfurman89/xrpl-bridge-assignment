import * as mongoose from 'mongoose'

export const TransactionSchema = new mongoose.Schema({
  account: String!,
  destination: String!,
  amount: String,
  currency: String,
  hash: String!,
  message: String,
  error: String
})
