import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';
import 'antd/lib/pagination/style/css';
import Constants from 'components/Constants';
import ConnectionStatus from 'components/ConnectionStatus';
import Button from '@bit/mybit.ui.showcase.button';
import ProgressBar from '@bit/mybit.ui.showcase.progress-bar';
import LoadingIndicator from 'components/LoadingIndicator';
import Alert from 'components/Alert';
import PropTypes from 'prop-types';

const StyledTable = styled.div`
  .ant-table-placeholder{
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .ant-table-content{
    background-color: white;
    border-radius: 4px;
  }
  .ant-table-body{
    min-width: 768px;
    tr:last-child td{
      border: none;
    }
    th {
      border-top-right-radius: 4px;
    }
  }
`;

const StyledAlert = styled.div`
  font-size: 6px;
`;

const StyledText = styled.div`
  color: #096dd9
`;

export default class PayBillsPage extends React.Component {

  async componentDidMount() {
    return this.props.getUserBills();
  }

  state = {
    alertType: null,
    alertMessage: null,
    payingRecord: null
  };

  columns = [
    { title: 'Payee', 
      key: 'payee',
      render: (text, record) => record.payee
    },
    { title: 'You owe', 
      key: 'share',
      align: 'center',
      render: (text, record) => {
        return `${window.web3.utils.fromWei(record.userOwing.toString())} ETH`;
      }
    },
    {
      title: 'Status',
      key: 'status',
      align: 'center',
      render: (text, record) => this.statusRender(text, record),
    },
    {
      title: 'Pay',
      key: 'pay',
      align: 'center',
      render: (text, record) => this.paymentRender(text, record),
    },
  ];

  handlePay = async (text, record) => {
    this.setState({
      payingRecord: record,
      alertType: 'info',
      alertMessage: 'Waiting on confirmation',
    });
    await this.props
      .payShare(record.billID)
      .catch(e => {
        this.setState({
          alertType: 'error',
          alertMessage: e.message,
        });
      });
    await this.props.getUserBills();
    this.setState({
      payingRecord: null,
      alertType: null,
      alertMessage: null,
    });
  };

  statusRender = (text, record) => {
    const numPaid = record.payers.filter(e => e.paid === true).length;
    const percentPaid = (numPaid/record.numPayers) * 100;
    return (
    <React.Fragment>
      {`${numPaid}/${record.numPayers} Paid`}
      <ProgressBar status={percentPaid === 100 ? 'success' : 'active'} percent={percentPaid} showInfo={false}/>
    </React.Fragment>
    )
  }

  paymentRender = (text, record) => {
    if (this.state.payingRecord !== record) {
      return record.payers.find(
        p => p.address === this.props.user.userName
        ).paid ? record.payers.filter(e => e.paid === true).length === record.numPayers ? 
        (<StyledText>Payment Released</StyledText>) : (<StyledText>Payment Sent</StyledText>) :
        (
          <Button
            color='blue'
            type='solid'
            onClick={() => this.handlePay(text, record)}
          >
            Pay
          </Button>
        )
    }
    return (
      <StyledAlert>
        <Alert
          type={this.state.alertType}
          message={this.state.alertMessage}
          closeable={false}
        />
      </StyledAlert>
    );
  }

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
          <title>Pay Bills - MyBit Fork</title>
          <meta
            name="Pay Bills"
            content="See and pay your bills on the MyBit Fork dapp"
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
            dataSource={this.props.userBills}
            pagination={false}
          />
        </StyledTable>
        {this.state.alert && (
          <Alert
            type={this.state.alert.Type}
            message={this.state.alert.Message}
            handleAlertClosed={this.closeAlert}
            showIcon
            closable
          />
        )}
      </div>
    );
  }
}

PayBillsPage.propTypes = {
  userTransactions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  loadingNetwork: PropTypes.bool.isRequired,
};
