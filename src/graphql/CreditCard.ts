import { gql } from '@apollo/client';

// Queries

export const CREDIT_CARDS = gql`
  query filterCreditCard($name: String, $id: String, $skip: Int, $take: Int) {
    creditCards: findManyCreditCard(
      skip: $skip
      take: $take
      where: { accountId: { equals: $id }, name: { contains: $name }, deletedAt: { equals: null } }
      orderBy: [{ createdAt: desc }]
    ) {
      data {
        id
        name
        brand
        limit
      }
      pagination {
        totalItems
      }
    }
  }
`;

// find one Credit Card
export const GET_ONE_CREDIT_CARD = gql`
  query getUniqueCreditCard($id: String!) {
    findUniqueCreditCard(where: { id: $id }) {
      id
      name
      limit
      brand
    }
  }
`;

export const ALL_CREDIT_CARDS_LIMIT = gql`
  query allCreditCardLimit($accountId: String!) {
    allCreditCardsLimit: calcManyCreditCardLimit(where: {accountId: $accountId}) {
    limit
    limitFree
    limitBlocked
    creditCard {
      id
      name
    }
  }
}
`;

// Mutations

export const CREATE_CREDIT_CARD = gql`
  mutation createCreditCard(
    $name: String!
    $limit: Float!
    $brand: CreditCardBrand!
    $account: String!
  ) {
    createOneCreditCard(data: { name: $name, limit: $limit, brand: $brand, accountId: $account }) {
      id
      name
      limit
      brand
    }
  }
`;

// delete CreditCard

export const DELETE_CREDIT_CARD = gql`
  mutation deleteCreditCard($id: String!) {
    deleteOneCreditCard(where: { id: $id }) {
      id
      name
      deletedAt
    }
  }
`;

// update Credit Card

export const UPDATE_CREDIT_CARD = gql`
  mutation updateCreditCard(
    $id: String!
    $name: String!
    $limit: Float!
    $brand: CreditCardBrand!
    $account: String!
  ) {
    updateOneCreditCard(
      where: { id: $id }
      data: { name: $name, limit: $limit, brand: $brand, accountId: $account }
    ) {
      id
      name
    }
  }
`;

// restore Credit Card

export const RESTORE_CREDIT_CARD = gql`
  mutation restoreCreditCard($id: String!) {
    restoreOneCreditCard(where: { id: $id }) {
      id
      name
    }
  }
`;
