import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BookingCarDetails from "./BookingCarDetails";
import type { BookingInfo } from "../types/booking";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>(
        "react-router-dom",
    );
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe("BookingCarDetails", () => {
    const baseBookingInfo: BookingInfo = {
        date: "2025-12-25",
        heure: "14:30",
        depart: "Paris",
        arrivee: "Lyon",
        typeTrajet: "simple",
        vehicule: "berline",
    } as BookingInfo;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("affiche les informations de réservation de base", () => {
        render(
            <MemoryRouter>
                <BookingCarDetails bookingInfo={baseBookingInfo} distance="100 km" />
            </MemoryRouter>,
        );

        expect(screen.getByText("Détails de la Réservation")).toBeInTheDocument();
        expect(screen.getByText("Date:")).toBeInTheDocument();
        expect(screen.getByText("Heure:")).toBeInTheDocument();
        expect(screen.getByText("Lieu de départ:")).toBeInTheDocument();
        expect(screen.getByText("Destination:")).toBeInTheDocument();
        expect(screen.getByText("Distance parcourue:")).toBeInTheDocument();

        expect(screen.getByText(baseBookingInfo.date)).toBeInTheDocument();
        expect(screen.getByText(baseBookingInfo.heure)).toBeInTheDocument();
        expect(screen.getByText(baseBookingInfo.depart)).toBeInTheDocument();
        expect(screen.getByText(baseBookingInfo.arrivee)).toBeInTheDocument();
        expect(screen.getByText("100 km")).toBeInTheDocument();
    });

    it("appelle onPriceCalculated avec le bon prix pour une berline", () => {
        const mockOnPriceCalculated = vi.fn();

        render(
            <MemoryRouter>
                <BookingCarDetails
                    bookingInfo={{ ...baseBookingInfo, vehicule: "berline" }}
                    distance="50 km"
                    onPriceCalculated={mockOnPriceCalculated}
                />
            </MemoryRouter>,
        );

        expect(mockOnPriceCalculated).toHaveBeenCalledWith(100);
    });

    it("n'appelle pas onPriceCalculated avec un prix non nul quand la distance est invalide", () => {
        const mockOnPriceCalculated = vi.fn();

        render(
            <MemoryRouter>
                <BookingCarDetails
                    bookingInfo={{ ...baseBookingInfo, vehicule: "berline" }}
                    distance="N/A"
                    onPriceCalculated={mockOnPriceCalculated}
                />
            </MemoryRouter>,
        );

        expect(mockOnPriceCalculated).toHaveBeenCalledWith(0);
    });

    it("permet de cliquer sur le bouton de modification", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <BookingCarDetails bookingInfo={baseBookingInfo} distance="100 km" />
            </MemoryRouter>,
        );

        const button = screen.getByRole("button", { name: /modifier détails/i });
        await user.click(button);

        expect(button).toBeInTheDocument();
    });
});
