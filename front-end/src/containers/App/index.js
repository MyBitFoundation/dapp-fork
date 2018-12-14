/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import CreateNewPage from 'containers/CreateNewPage/Loadable';
import PayBillsPage from 'containers/PayBillsPage/Loadable';
import TransactionsPage from 'containers/TransactionsPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import AppWrapper from 'components/AppWrapper';
import MyBitForkLogo from 'components/MyBitForkLogo';
import PageWrapper from 'components/PageWrapper';
import BlockchainInfoContext from 'context/BlockchainInfoContext';
import { Links } from '../../constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mobileMenuOpen: false };
    this.handleClickMobileMenu = this.handleClickMobileMenu.bind(this);
  }

  handleClickMobileMenu(mobileMenuOpen) {
    this.setState({ mobileMenuOpen });
  }

  render() {
    const { mobileMenuOpen } = this.state;
    return (
      <AppWrapper mobileMenuOpen={mobileMenuOpen}>
        <Helmet defaultTitle="MyBit Fork">
          <meta
            name="description"
            content="Schedule a transaction in the ethereum network"
          />
        </Helmet>
        <Header
          logo={MyBitForkLogo}
          links={Links}
          optionalButton
          mobileMenuOpen={mobileMenuOpen}
          handleClickMobileMenu={this.handleClickMobileMenu}
        />
        <PageWrapper>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route
              path="/paybills"
              component={() => (
                <BlockchainInfoContext.Consumer>
                  {({
                    getUserBills,
                    getUserOwing,
                    userBills,
                    payShare,
                    loading,
                    network,
                    user
                  }) => (
                    <PayBillsPage
                      user={user}
                      payShare={payShare}
                      userBills={userBills}
                      getUserBills={getUserBills}
                      getUserOwing={getUserOwing}
                      loading={loading.userBills}
                      network={network}
                      loadingNetwork={loading.network}
                    />
                  )}
                </BlockchainInfoContext.Consumer>
              )}
            />
            <Route
              path="/transactions"
              component={() => (
                <BlockchainInfoContext.Consumer>
                  {({
                    getUserTransactions,
                    userTransactions,
                    loading,
                    network,
                    user
                  }) => (
                    <TransactionsPage
                      user={user}
                      getUserTransactions={getUserTransactions}
                      userTransactions={userTransactions}
                      loading={loading.userTransactions}
                      network={network}
                      loadingNetwork={loading.network}
                    />
                  )}
                </BlockchainInfoContext.Consumer>
              )}
            />
            <Route
              path="/create-new"
              component={() => (
                <BlockchainInfoContext.Consumer>
                  {({
                    currentBlock,
                    userAllowed,
                    requestApproval,
                    createBillEqual,
                    checkAddressAllowed,
                    user,
                    loading,
                    network,
                  }) => (
                    <CreateNewPage
                      currentBlock={currentBlock}
                      userAllowed={userAllowed}
                      requestApproval={requestApproval}
                      createBillEqual={createBillEqual}
                      checkAddressAllowed={checkAddressAllowed}
                      user={user}
                      loading={loading.user}
                      network={network}
                      loadingNetwork={loading.network}
                    />
                  )}
                </BlockchainInfoContext.Consumer>
              )}
            />
          </Switch>
        </PageWrapper>
        <Footer />
      </AppWrapper>
    );
  }
}

export default App;
