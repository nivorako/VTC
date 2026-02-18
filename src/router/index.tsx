// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Services from "../pages/Services";
import Connexion from "../pages/Connexion";
import MainLayout from "../layout/MainLayout";
import Booking from "../pages/Booking";
import BookingCar from "../pages/BookingCar";
import UserContact from "../pages/UserContact";
import UserPayment from "../pages/UserPayment";
import ScrollToTop from "../components/ScrollToTop";

/**
 * Routeur principal de l'application (React Router v6 - data router).
 *
 * Le layout racine inclut `ScrollToTop` + `MainLayout`, puis rend les pages en enfants.
 */
export const router = createBrowserRouter([
    {
        element: (
            <>
                <ScrollToTop />
                <MainLayout />
            </>
        ),
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/services",
                element: <Services />,
            },
            {
                path: "/connexion",
                element: <Connexion />,
            },
            {
                path: "/booking",
                element: <Booking />,
            },
            {
                path: "/bookingCar",
                element: <BookingCar />,
            },
            {
                path: "/user-contact",
                element: <UserContact />,
            },
            {
                path: "/user-payment",
                element: <UserPayment />,
            },
        ],
    },
]);
