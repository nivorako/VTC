// src/components/Footer.tsx
import styled from "styled-components";
import { theme } from "../styles/theme";

/**
 * Footer de l'application.
 * Affiche l'année courante et un texte de droits réservés.
 */
const Footer = () => {
    return (
        <FooterContainer>
            <p>
                &copy; {new Date().getFullYear()} VTC Prestige - Tous droits
                réservés
            </p>
        </FooterContainer>
    );
};

const FooterContainer = styled.footer`
    padding: 1rem;
    background: ${theme.colors.background};
    margin-top: 2rem;
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    text-align: center;
    color: white;
    box-sizing: border-box;
`;

export default Footer;
