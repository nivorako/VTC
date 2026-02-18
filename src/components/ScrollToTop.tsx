import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Remet la page en haut à chaque changement de route.
 * Ce composant ne rend rien (retourne `null`).
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Utiliser requestAnimationFrame pour une meilleure performance
        requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto", // 'auto' pour un défilement instantané
            });
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
