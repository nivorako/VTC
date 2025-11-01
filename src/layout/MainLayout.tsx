import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainContent = styled.main`
  position: relative;
  z-index: 1;
`;

const MainLayout = () => {
  const location = useLocation(); // Obtenir l'objet location
  return (
    <>
        <Header />
        <MainContent>
            {/* Ajouter la key ici pour forcer le re-montage */}
            <Outlet key={location.pathname} />
        </MainContent>
        <Footer />
    </>
  );
};

export default MainLayout;