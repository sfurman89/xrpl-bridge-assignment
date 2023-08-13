import { Document, ObjectId } from 'mongoose'

export interface ITransaction extends Document {
  readonly _id?: ObjectId
  readonly account: string
  readonly destination: string
  readonly amount?: string
  readonly hash: string
  readonly message?: string
}
