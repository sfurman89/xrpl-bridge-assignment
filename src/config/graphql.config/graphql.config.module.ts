import { Module } from '@nestjs/common'
import { unwrapResolverError } from '@apollo/server/errors'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ErrorException } from '../../common/exceptions/error.exception'
import * as path from 'path'
import * as process from 'process'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/gql/schema.gql'),
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true
      },
      context: ({ req }: { req: Request }) => ({ req }),
      formatError: (formattedError: any, error) => {
        const unwrappedError: any = unwrapResolverError(error)
        let errors: any = {}
        if (unwrappedError instanceof ErrorException) {
          errors = { ...(unwrappedError.getResponse() as object), status: unwrappedError.getStatus() }
        }
        return {
          message: formattedError.extensions?.exception?.response?.message || formattedError.message,
          path: formattedError.path,
          ...errors
        }
      }
    })
  ]
})
export class GraphqlConfigModule {}
