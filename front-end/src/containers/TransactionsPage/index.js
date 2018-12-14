import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';
import 'antd/lib/pagination/style/css';
import Constants from 'components/Constants';
import ConnectionStatus from 'components/ConnectionStatus';
import LoadingIndicator from 'components/LoadingIndicator';
import Img from 'components/Img';
import ExternalUrlIcon from './external-url-icon.png';
import PropTypes from 'prop-types';

const StyledTable = styled.div`
  .ant-table-placeholder{
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .Transactions__external-icon{
    width: 20px;
    float: right;
  }

  .ant-table-content{
    background-color: white;
    border-radius: 4px;
  }

  .ant-table-body{
    min-width: 650px;

    tr:last-child td{
      border: none;
    }
    th {
      border-top-right-radius: 4px;
    }
  }
`;


export default class TransactionsPage extends React.Component {

  columns = [
    { title: 'Event', 
      key: 'evt',
      dataIndex: 'name'
    },
    { title: 'Time', 
      key: 'date',
      dataIndex: 'date'
    },
    { title: 'Status', 
      key: 'status',
      align: 'center',
      render: (text, record) => (
      <a
          href={`https://ropsten.etherscan.io/tx/${record.hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Img
            className="Transactions__external-icon"
            src={ExternalUrlIcon}
            alt="See transaction on etherscan"
          />
          View on etherscan 
      </a>
      )
    },
  ];

  render() {
    const config = {
      bordered: false,
      loading: this.props.loading,
      size: 'default',
    };
    if (this.props.loading) {
      return <LoadingIndicator />;
    }
    return (
      <div>
        <Helmet>
          <title>Transactions - MyBit Fork</title>
          <meta
            name="Transactions"
            content="See your transactions on the MyBit Fork dapp"
          />
        </Helmet>
        <ConnectionStatus
          network={this.props.network}
          constants={Constants}
          loading={this.props.loadingNetwork}
        />
        <StyledTable>
          <Table
            bordered
            {...config}
            columns={this.columns}
            dataSource={this.props.userTransactions}
            pagination={false}
          />
        </StyledTable>
      </div>
    );
  }
}

TransactionsPage.propTypes = {
  userTransactions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  loadingNetwork: PropTypes.bool.isRequired,
};
