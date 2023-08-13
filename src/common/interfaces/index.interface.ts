import { GraphQLFormattedError } from 'graphql/error'

export interface IGraphQLErrorException extends GraphQLFormattedError {
  message: string
  context?: any
}
