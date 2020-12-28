import React from 'react';
import styled from 'styled-components';
import DropDownMenu from './DropDownMenu';
import MonthNavigation from './MonthNavigation';

const NavBar = () => {
  return (
    <NavBarContainer>
      <MonthNavigation />
      <DropDownMenu />
    </NavBarContainer>
  );
};

const NavBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 50px;
  max-height: 50px;
  background-color: #ffffff;
`;

export default NavBar;