import { useState } from "react";
import { theme } from "../styles/theme";
import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../auth/AuthContext";

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
    align-items: center;
    gap: 40px;
    padding: 10px 40px;
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

const UserBadge = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    border: none;
    background: #ffffff;
    color: ${theme.colors.background};
    font-weight: 700;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const UserMenu = styled.div`
    position: absolute;
    top: 56px;
    right: 10px;
    background: #ffffff;
    color: #111827;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    padding: 0.5rem 0;
    z-index: 1100;
`;

const UserMenuItem = styled.button`
    width: 100%;
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    text-align: left;
    font-size: 0.9rem;
    cursor: pointer;
    color: inherit;

    &:hover {
        background: #f3f4f6;
    }
`;

/**
 * Header principal de l'application.
 *
 * - Affiche la navigation (desktop + menu mobile)
 * - Affiche un badge utilisateur si connecté et permet la déconnexion
 */
function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    /**
     * Toggle du menu mobile.
     */
    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const initial = user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || user?.email.charAt(0) || "U";

    /**
     * Déconnecte l'utilisateur et ferme le menu utilisateur.
     */
    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
    };

    return (
        <HeaderContainer>
            <RouterNavLink to="/">
                <Logo src="/rnLogo.png" alt="Logo" />
            </RouterNavLink>

            <Nav>
                <StyledNavLink to="/contact">Contact</StyledNavLink>
                <StyledNavLink to="/services">Services</StyledNavLink>
                {!user && <StyledNavLink to="/connexion">Connexion</StyledNavLink>}
                {user && (
                    <div style={{ position: "relative" }}>
                        <UserBadge
                            type="button"
                            onClick={() => setIsUserMenuOpen((prev) => !prev)}
                        >
                            {initial.toUpperCase()}
                        </UserBadge>
                        {isUserMenuOpen && (
                            <UserMenu>
                                <UserMenuItem type="button" onClick={handleLogout}>
                                    Déconnexion
                                </UserMenuItem>
                            </UserMenu>
                        )}
                    </div>
                )}
            </Nav>
            <MenuIcon onClick={handleClick} />
            {isOpen && (
                <MobileMenu>
                    <CrossIcon onClick={handleClick} />
                    <StyledNavLink to="/contact" onClick={handleClick}>
                        Contact
                    </StyledNavLink>
                    <StyledNavLink to="/services" onClick={handleClick}>
                        Services
                    </StyledNavLink>
                    {!user && (
                        <StyledNavLink to="/connexion" onClick={handleClick}>
                            Connexion
                        </StyledNavLink>
                    )}
                </MobileMenu>
            )}
        </HeaderContainer>
    );
}

export default Header;
