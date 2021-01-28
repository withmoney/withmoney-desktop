import { useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useOperationsFilters } from './useOperationsFilters';
import { useAccountFilters } from './useAccountFilters';
import { UPDATE_OPERATION, RESTORE_OPERATION } from '../graphql/Operations';
import { DELETE_OPERATION, GET_OPERATIONS, CREATE_OPERATION } from '../graphql/Operations';
import { Operation } from '../models';
import useNProgress from './useNProgress';

type Data = {
  operations: Operation[];
};

export function useOperations() {
  const { currentAccountId } = useAccountFilters();
  const { currentDateTime } = useOperationsFilters();

  const [getOperations, { data, loading, error }] = useLazyQuery<Data>(GET_OPERATIONS, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (currentAccountId) {
      getOperations({
        variables: {
          startDateTime: currentDateTime?.startOf('month'),
          endDateTime: currentDateTime?.endOf('month'),
          accountId: currentAccountId,
        },
      });
    }
  }, [currentAccountId, currentDateTime]);

  useNProgress(loading);

  if (!currentAccountId) return { data: undefined, loading: true };

  return { getOperations, data, loading, error };
}

export function useUpdateOperation() {
  const { currentDateTime } = useOperationsFilters();
  const { currentAccountId } = useAccountFilters();

  const [updateOperation, { data, error, loading }] = useMutation<Data>(UPDATE_OPERATION, {
    refetchQueries: [
      {
        query: GET_OPERATIONS,
        variables: {
          startDateTime: currentDateTime?.startOf('month'),
          endDateTime: currentDateTime?.endOf('month'),
          accountId: currentAccountId,
        },
      },
    ],
  });

  useNProgress(loading);

  return { updateOperation, data, error };
}

export function useDeleteOperation() {
  const { currentDateTime } = useOperationsFilters();
  const { currentAccountId } = useAccountFilters();

  const [deleteOperation, { data, error, loading }] = useMutation(DELETE_OPERATION, {
    refetchQueries: [
      {
        query: GET_OPERATIONS,
        variables: {
          startDateTime: currentDateTime?.startOf('month'),
          endDateTime: currentDateTime?.endOf('month'),
          accountId: currentAccountId,
        },
      },
    ],
  });

  useNProgress(loading);

  return { deleteOperation, data, loading, error };
}

export function useRestoreOperation() {
  const { currentDateTime } = useOperationsFilters();
  const { currentAccountId } = useAccountFilters();

  const [restoreOperation, { data, error, loading }] = useMutation(RESTORE_OPERATION, {
    refetchQueries: [
      {
        query: GET_OPERATIONS,
        variables: {
          startDateTime: currentDateTime?.startOf('month'),
          endDateTime: currentDateTime?.endOf('month'),
          accountId: currentAccountId,
        },
      },
    ],
  });

  useNProgress(loading);

  return { restoreOperation, data, error, loading };
}

export function useCreateOperation() {
  const { currentDateTime } = useOperationsFilters();
  const { currentAccountId } = useAccountFilters();
  const [createOperation, { data, error, loading }] = useMutation(CREATE_OPERATION, {
    refetchQueries: [
      {
        query: GET_OPERATIONS,
        variables: {
          startDateTime: currentDateTime?.startOf('month'),
          endDateTime: currentDateTime?.endOf('month'),
          accountId: currentAccountId,
        },
      },
    ],
  });

  useNProgress(loading);

  return { createOperation, data, error, loading };
}
