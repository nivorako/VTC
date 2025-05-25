import { useState } from "react";
import { theme } from "../styles/theme";
import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";
import {FaBars} from "react-icons/fa6";

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  background: transparent;
  backdrop-filter: blur(10px); /* Effet de flou pour améliorer la lisibilité */
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

const Logo = styled.img`
  height: 50px; /* Ajuste selon ton logo */
`;

const Nav = styled.nav`
  display: flex;
  gap: 100px;
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
    color: ${theme.colors.textHover};
  }

  &.active {
    color: ${theme.colors.textHover};
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
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: absolute;
    top: 60px;
    right: 0;
    background: ${theme.colors.background};
    padding: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  console.log("isOpen", isOpen);
  return (
    <HeaderContainer>
      <RouterNavLink to="/">
        <Logo src="/rnLogo.png" alt="Logo" style={{ height: '100px' }} />
      </RouterNavLink>
      
      <Nav>
        <StyledNavLink to="/contact">Contact</StyledNavLink>
        <StyledNavLink to="/services">Services</StyledNavLink>
        <StyledNavLink to="/mentions">Mentions</StyledNavLink>
      </Nav>
      <MenuIcon onClick={handleClick}/>
    </HeaderContainer>
  );
}

export default Header;
