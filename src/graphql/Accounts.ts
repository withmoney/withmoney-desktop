import { gql } from '@apollo/client';

// query
export const GET_ACCOUNTS = gql`
  query getAccounts {
    accounts: findManyAccount(where: { deletedAt: { equals: null } }, orderBy: [{ name: asc }]) {
      id
      name
      currency
    }
  }
`;

export const GET_ONE_ACCOUNT = gql`
  query getUniqueAccount($id: String!) {
    findUniqueAccount(where: { id: $id }) {
      id
      name
      currency
      deletedAt
    }
  }
`;

// mutations
export const CREATE_ACCOUNT = gql`
  mutation createAccount($name: String!, $currency: Currency!) {
    createOneAccount(data: { name: $name, currency: $currency }) {
      id
      name
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation updateAccount($id: String!, $name: String!, $currency: Currency!) {
    updateOneAccount(where: { id: $id }, data: { name: $name, currency: $currency }) {
      id
      name
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation deleteAccount($id: String!) {
    deleteOneAccount(where: { id: $id }) {
      id
      name
    }
  }
`;

export const RESTORE_ACCOUNT = gql`
  mutation restoreAccount($id: String!) {
    restoreOneAccount(where: { id: $id }) {
      id
      name
    }
  }
`;
