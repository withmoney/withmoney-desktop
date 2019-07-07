import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classname from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import ButtonRounded from 'components/ButtonRounded';
import * as TransactionsActions from 'store/transactions';
import TransactionsList from 'components/TableTransactionList';
import TableTransactionsFooter from 'components/TableTransactionsFooter';
import { TransactionActionsTypes, TransactionListTypes } from 'app/types/transactions';

const ButtonNavigation = ({ onClick, direction, month }) => (
  <button type="button" className="tab-months__navigation" onClick={onClick(direction)}>
    {month.format('MMMM YY')}
  </button>
);

ButtonNavigation.propTypes = {
  onClick: PropTypes.func.isRequired,
  direction: PropTypes.string.isRequired,
  month: PropTypes.any.isRequired,
};

class TableTransactions extends React.Component {
  constructor(props) {
    super(props);

    this.changeTab = this.changeTab.bind(this);
    this.onNavigate = this.onNavigate.bind(this);

    const currentMoment = moment.tz('UTC');

    this.state = {
      type: 'in',
      currentMonth: currentMoment,
      previousMonth: currentMoment.clone().subtract(1, 'month'),
      nextMonth: currentMoment.clone().add(1, 'month'),
    };
  }

  componentDidMount() {
    this.getTransactions();
  }

  onNavigate(direction) {
    return () => {
      const { currentMonth } = this.state;
      let newState;

      if (direction === 'next') {
        newState = {
          previousMonth: currentMonth,
          currentMonth: currentMonth.clone().add(1, 'month'),
          nextMonth: currentMonth.clone().add(2, 'month'),
        };
      } else {
        newState = {
          previousMonth: currentMonth.clone().subtract(2, 'month'),
          currentMonth: currentMonth.clone().subtract(1, 'month'),
          nextMonth: currentMonth,
        };
      }

      this.setState(newState, this.getTransactions);
    };
  }

  async getTransactions() {
    const { actions } = this.props;
    const { currentMonth } = this.state;

    const start = moment(currentMonth)
      .startOf('month')
      .toISOString();
    const end = moment(currentMonth)
      .endOf('month')
      .toISOString();

    const query = {
      batch: 'Categories',
      order: 'transactionDate.asc',
      transactionDate: [start, end].join(','),
    };

    await actions.transaction.list(query);
  }

  changeTab(typeTab, type) {
    this.setState({
      [typeTab]: type,
    });
  }

  transactionByType() {
    const {
      transactions: { data },
    } = this.props;
    const { type } = this.state;

    return data.filter(transaction => transaction.type === type);
  }

  isFirstLoading() {
    const { transactions } = this.props;

    return transactions.isLoading && !transactions.data.length;
  }

  render() {
    const { type, currentMonth, nextMonth, previousMonth } = this.state;
    const { transactions } = this.props;

    const columns = [
      { name: 'isPaid', label: 'Is Paid?', style: { flexBasis: '15%' } },
      { name: 'transactionDate', label: 'Date', style: { flexBasis: '15%' } },
      { name: 'name', label: 'Name', style: { flexBasis: '20%' } },
      { name: 'CategoryId', label: 'Category', style: { flexBasis: '20%' } },
      { name: 'value', label: 'Value', style: { flexBasis: '15%' } },
      { name: 'action', label: 'Action', style: { flexBasis: '15%' } },
    ];

    return (
      <div className="table-transactions">
        <div className="table-transactions__tabs">
          <div className="tab-in-out">
            <button
              type="button"
              id="tab-in"
              className={classname('tab-in-out__tab', {
                'tab-in-out__tab--in-actived': type === 'in',
              })}
              onClick={() => this.changeTab('type', 'in')}
            >
              In
            </button>
            <button
              type="button"
              id="tab-out"
              className={classname('tab-in-out__tab', {
                'tab-in-out__tab--out-actived': type === 'out',
              })}
              onClick={() => this.changeTab('type', 'out')}
            >
              Out
            </button>
          </div>
          <div className="tab-months">
            <ButtonNavigation
              onClick={this.onNavigate}
              direction="previous"
              month={previousMonth}
            />
            <span className="tab-months__current">{currentMonth.format('MMMM YY')}</span>
            <ButtonNavigation onClick={this.onNavigate} direction="next" month={nextMonth} />
          </div>
        </div>
        <div className="table-transactions__header">
          {columns.map(column => (
            <div key={column.name} className="table-transactions__header-col" style={column.style}>
              <div className="table-transactions__header-col-inner">{column.label}</div>
            </div>
          ))}
        </div>
        <div className="table-transactions__body">
          <TransactionsList
            columns={columns}
            list={this.transactionByType()}
            isLoading={this.isFirstLoading()}
          />
          <div className="table-transactions__action">
            <ButtonRounded disabled={transactions.isLoading}>Add Transaction</ButtonRounded>
          </div>
        </div>
        <TableTransactionsFooter transactions={transactions.data} />
      </div>
    );
  }
}

TableTransactions.propTypes = {
  actions: TransactionActionsTypes.isRequired,
  transactions: PropTypes.shape({
    data: TransactionListTypes,
    isLoading: PropTypes.bool,
  }),
};

TableTransactions.defaultProps = {
  transactions: {
    data: [],
    isLoading: false,
  },
};

const mapDispatchToProps = dispatch => ({
  actions: {
    transaction: bindActionCreators(TransactionsActions, dispatch),
  },
});

const mapStateToProps = ({ transactions }) => ({ transactions });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableTransactions);
