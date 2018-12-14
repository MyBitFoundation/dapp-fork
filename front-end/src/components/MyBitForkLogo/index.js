import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Logo from './logo.svg';
import Img from '../Img';

const StyledLogo = styled(Link)`
  position: absolute;
  top: 21px;
  left: 21px;
`;

const MyBitForkLogo = (
  <StyledLogo to="/">
    <Img src={Logo} alt="MyBit Fork Dapp" />
  </StyledLogo>
);

export default MyBitForkLogo;
