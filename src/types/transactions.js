import PropTypes from 'prop-types';

export const TransactionActionsTypes = PropTypes.shape({
  transaction: PropTypes.shape({
    put: PropTypes.func.isRequired,
    list: PropTypes.func.isRequired,
  }).isRequired,
});

export const TransactionTypes = PropTypes.shape({
  id: PropTypes.number,
  transactionDate: PropTypes.string,
  name: PropTypes.string,
  CategoryId: PropTypes.number,
  value: PropTypes.string,
  isLoading: PropTypes.bool,
});

export const TransactionListTypes = PropTypes.arrayOf(TransactionTypes);