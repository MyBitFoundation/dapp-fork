/*
 * Create New Payroll Page
 *
 * Page to create payroll contracts
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components/macro';
import ContainerCreate from 'components/ContainerCreate';
import Input from 'components/Input';
import Constants from 'components/Constants';
import Checkbox from 'antd/lib/checkbox';
import LoadingIndicator from 'components/LoadingIndicator';
import ConnectionStatus from 'components/ConnectionStatus';
import Button from '@bit/mybit.ui.showcase.button';
import Image from '../../images/secure.svg';

import 'antd/lib/checkbox/style/css';

const StyledTermsAndConditions = styled.s`
  font-size: 12px;
  font-family: 'Roboto';
  margin-bottom: 10px;
  text-decoration: none;

  a {
    color: #1890ff;
  }
`;

const StyledClickHere = styled.s`
  color: #1890ff;
  text-decoration: underline;
`;

const StyledTermsAndConditionsWrapper = styled.div`
  margin-bottom: 10px;
`;

const StyledButtonWrapper = styled.div`
  width: 100%;
`;

const StyledEmployeeInputWrapper = styled.div`
  display: flex;
  color: #1890ff;
  text-decoration: underline;
`;

const StyledLargeInput = styled.div`
  width: 70%;
  margin-right: 4%;
`;

export default class CreateNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldConfirm: false,
      acceptedToS: false,
      payers: ['',''],
      payee: null,
      billAmount: null,
    };
    this.details = [];
  }

  handleClose = () => {
    this.setState({
      shouldConfirm: false,
    });
  }

  handleBack = () => {
    this.setState({ shouldConfirm: false });
  };

  handleConfirm = async () => {
    const { payers, payee, billAmount } = this.state;
    let alertType;
    let alertMessage;
    this.setState({ alertType });

    for (let i = 0; i < payers.length; i++) {
      if (!window.web3.utils.isAddress(payers[i])) {
        alertMessage = `Please enter a valid ethereum address for payer #${i +
          1}`;
      }
    }

    if (this.props.user.myBitBalance < 250) {
      alertMessage = (
        <span>
          Your MYB balance is below 250, click
          <StyledClickHere
            onClick={() => BancorConvertWidget.showConvertPopup('buy')} // eslint-disable-line no-undef
          >
            here
          </StyledClickHere>{' '}
          to buy more.
        </span>
      );
    }
    if (alertMessage) {
      alertType = 'error';
      this.setState({
        alertType,
        alertMessage,
      });
      return;
    }

    this.setState({ shouldConfirm: true });
    this.setState({
      alertType: 'info',
      alertMessage: 'Waiting for confirmations.',
    });

    try {
      let result = true;
      if (!this.props.userAllowed) {
        result = await this.props.requestApproval();
      }

      if (result) {
        result = await this.props.createBillEqual(
          payee,
          billAmount,
          payers,
        );
      }
      if (result) {
        this.setState({
          alertType: 'success',
          alertMessage: 'Transaction confirmed.',
        });
      } else {
        this.setState({
          alertType: 'error',
          alertMessage: 'Transaction failed. Please try again with more gas.',
        });
      }
      this.props.checkAddressAllowed();
    } catch (err) {
      this.setState({ alertType: undefined });
    }
  }

  handleTermsAndConditionsClicked = e => {
    this.setState({ acceptedToS: e.target.checked });
  };

  handleAlertClosed = () => {
    this.setState({ alertType: undefined });
  };

  handleInputChange = (text, id) => {
    this.setState({
      [id]: text,
    });
  };

  handlePayerChange = (value, idx) => {
    const { payers } = this.state;
    payers[idx] = value;
    this.setState({ payers });
  }

  addPayer = () => {
    this.setState(prevState => ({
      payers: [...prevState.payers, ''],
    }));
  };

  render() {
    const toRender = [];
    if (this.props.loading) {
      return <LoadingIndicator />;
    }

    toRender.push(
      <ConnectionStatus
        network={this.props.network}
        constants={Constants}
        key="connection status"
        loading={this.props.loadingNetwork}
      />,
    );

    const content = (
      <div key="content">
        <Input
          placeholder="Payee address"
          value={this.state.payee}
          onChange={e => this.handleInputChange(e.target.value, 'payee')}
          tooltipTitle="What is the ethereum address for the payee of this bill?"
          hasTooltip
        />
        <Input
          placeholder="Bill amount"
          value={this.state.billAmount}
          onChange={e => this.handleInputChange(e.target.value, 'billAmount')}
          tooltipTitle="What is the amount of this bill, to be split evenly among the payers?"
          hasTooltip
        />
        {this.state.payers.map((payer, idx) => (
          <StyledEmployeeInputWrapper>
            <StyledLargeInput>
              <Input
                placeholder={`Payer ${idx + 1} address`}
                value={this.state.payers[idx]}
                onChange={e =>
                  this.handlePayerChange(e.target.value, idx)
                }
              />
            </StyledLargeInput>
          </StyledEmployeeInputWrapper>
        ))}
        <StyledButtonWrapper>
          <Button
            size="small"
            onClick={this.addPayer}
            theme="none"
            type="outline"
          >
            Add payer
          </Button>
        </StyledButtonWrapper>

        <StyledTermsAndConditionsWrapper>
          <Checkbox onChange={this.handleTermsAndConditionsClicked}>
            <StyledTermsAndConditions>
              I agree to the <a href="#">Terms and Conditions</a>
              .
            </StyledTermsAndConditions>
          </Checkbox>
        </StyledTermsAndConditionsWrapper>
      </div>
    );
    if (this.state.shouldConfirm) {
      toRender.push(
        <ContainerCreate
          key="containerConfirm"
          type="confirm"
          handleClose={this.handleClose}
          handleBack={this.handleBack}
          alertType={this.state.alertType}
          alertMessage={this.state.alertMessage}
          handleAlertClosed={this.handleAlertClosed}
          payers={this.state.payers}
          payee={this.state.payee}
          billAmount={this.state.billAmount}
        />,
      );
    } else {
      toRender.push(
        <ContainerCreate
          key="containerCreate"
          type="input"
          image={Image}
          alt="Placeholder image"
          content={content}
          handleConfirm={this.handleConfirm}
          alertType={this.state.alertType}
          alertMessage={this.state.alertMessage}
          handleAlertClosed={this.handleAlertClosed}
          acceptedToS={this.state.acceptedToS}
        />,
      );
    }

    return (
      <article>
        <Helmet>
          <title>Create - MyBit Payroll</title>
          <meta
            name="Create"
            content="Create a bill on the MyBit Fork dApp"
          />
        </Helmet>
        {toRender}
      </article>
    );
  }
}

CreateNewPage.defaultProps = {
  userAllowed: false,
  currentBlock: 0,
};

CreateNewPage.propTypes = {
  userAllowed: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    myBitBalance: PropTypes.number.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  loadingNetwork: PropTypes.bool.isRequired,
};
