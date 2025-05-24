
import { theme } from "../styles/theme";
import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";


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

function Header() {
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
    </HeaderContainer>
  );
}

export default Header;
