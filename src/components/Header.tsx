import { useState } from "react";
import { theme } from "../styles/theme";
import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";
import {FaBars} from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  max-width: 1440px;
  width: 100%;
  background: ${theme.colors.background};
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

const Logo = styled.img`
  height: 50px; 
`;

const Nav = styled.nav`
  display: flex;
  gap: 100px;
 
  padding: 10px 100px;
  border-radius: 5px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledNavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: 0.3s;

  &:hover {
    color: ${theme.colors.primary};
  }

  &.active {
    color: ${theme.colors.primary};
  }
`;

const MenuIcon = styled(FaBars)`
  color: white;
  cursor: pointer;
  font-size: 32px;
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.nav`
  display: none;
  @media (max-width: 768px) {
    width: 80%;
    height: 90vh;
    display: flex;
    flex-direction: column;
    gap: 50px;
    position: absolute;
    top: 20px;
    right: 0;
    background: ${theme.colors.background};
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const CrossIcon = styled(RxCross2)`
  color: white;
  cursor: pointer;
  font-size: 32px;
`;

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderContainer>
      <RouterNavLink to="/">
        <Logo src="/rnLogo.png" alt="Logo" />
      </RouterNavLink>
      
      <Nav>
        <StyledNavLink to="/contact">Contact</StyledNavLink>
        <StyledNavLink to="/services">Services</StyledNavLink>
        <StyledNavLink to="/mentions">Mentions</StyledNavLink>
      </Nav>
      <MenuIcon onClick={handleClick}/>
      {isOpen && (
      <MobileMenu>
        <CrossIcon onClick={handleClick}/>
        <StyledNavLink to="/contact" onClick={handleClick}>Contact</StyledNavLink>
        <StyledNavLink to="/services" onClick={handleClick}>Services</StyledNavLink>
        <StyledNavLink to="/mentions" onClick={handleClick}>Mentions</StyledNavLink>
      </MobileMenu>
      )}
    </HeaderContainer>
    
  );
}

export default Header;
