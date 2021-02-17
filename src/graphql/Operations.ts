import { gql } from '@apollo/client';

// query
export const GET_OPERATIONS = gql`
  query getOperations($startDateTime: DateTime!, $endDateTime: DateTime!, $accountId: String!) {
    operations: findManyOperation(
      where: {
        paidAt: { gte: $startDateTime, lte: $endDateTime }
        deletedAt: { equals: null }
        accountId: { equals: $accountId }
      }
      orderBy: [{ paidAt: asc }, { createdAt: asc }]
    ) {
      id
      name
      value
      type
      isPaid
      paidAt
      createdAt
      accountId
      categoryId
      creditCardId
    }
    balance: calcPreviousBalance(where: { paidAt: { lt: $startDateTime } }) {
      amount
    }
  }
`;
// mutations

export const UPDATE_OPERATION = gql`
  mutation updateOperation(
    $id: String!
    $name: String!
    $categoryId: String
    $accountId: String!
    $type: TransactionType!
    $value: Float!
    $isPaid: Boolean!
    $paidAt: DateTime!
    $creditCardId: String
  ) {
    updateOneOperation(
      where: { id: $id }
      data: {
        name: $name
        type: $type
        accountId: $accountId
        categoryId: $categoryId
        value: $value
        isPaid: $isPaid
        paidAt: $paidAt
        creditCardId: $creditCardId
      }
    ) {
      id
      name
    }
  }
`;

export const DELETE_OPERATION = gql`
  mutation deleteOperation($id: String!) {
    deleteOneOperation(where: { id: $id }) {
      id
      name
    }
  }
`;

export const RESTORE_OPERATION = gql`
  mutation restoreOperation($id: String!) {
    restoreOneOperation(where: { id: $id }) {
      id
      name
    }
  }
`;

export const CREATE_OPERATION = gql`
  mutation createOperation($type: TransactionType!, $accountID: String!, $paidAt: DateTime!) {
    createOneOperation(
      data: {
        type: $type
        accountId: $accountID
        paidAt: $paidAt
        name: ""
        isPaid: false
        value: 0
      }
    ) {
      id
      name
    }
  }
`;
