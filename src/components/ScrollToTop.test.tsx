import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

describe("ScrollToTop Component", () => {
    let scrollToMock: ReturnType<typeof vi.fn>;
    let rafMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Mock window.scrollTo
        scrollToMock = vi.fn();
        global.window.scrollTo = scrollToMock as (options?: ScrollToOptions) => void;

        // Mock requestAnimationFrame
        rafMock = vi.fn((callback) => {
            callback(0);
            return 0;
        });
        global.requestAnimationFrame = rafMock as unknown as (callback: FrameRequestCallback) => number;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("devrait rendre null (ne rien afficher)", () => {
        const { container } = render(
            <MemoryRouter>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(container.firstChild).toBeNull();
    });

    it("devrait scroller vers le haut au montage", () => {
        render(
            <MemoryRouter>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(rafMock).toHaveBeenCalled();
        expect(scrollToMock).toHaveBeenCalledWith({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    });

    it("devrait scroller vers le haut quand le pathname change", async () => {
        let navigateFunction: ReturnType<typeof useNavigate> | null = null;

        // Composant helper pour capturer la fonction navigate
        const NavigationCapture = () => {
            navigateFunction = useNavigate();
            return null;
        };

        render(
            <MemoryRouter initialEntries={["/"]}>
                <ScrollToTop />
                <NavigationCapture />
                <Routes>
                    <Route path="*" element={<div>Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(scrollToMock).toHaveBeenCalledTimes(1);
        scrollToMock.mockClear();

        // Naviguer vers un nouveau chemin
        expect(navigateFunction).not.toBeNull();
        await act(async () => {
            navigateFunction!("/nouveau-chemin");
        });

        // Vérifier que le scroll a été appelé
        expect(scrollToMock).toHaveBeenCalled();

        expect(scrollToMock).toHaveBeenCalledWith({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    });

    it("devrait utiliser requestAnimationFrame pour la performance", () => {
        render(
            <MemoryRouter>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(rafMock).toHaveBeenCalled();
        expect(rafMock).toHaveBeenCalledWith(expect.any(Function));
    });

    it("devrait scroller avec behavior auto pour un défilement instantané", () => {
        render(
            <MemoryRouter>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(scrollToMock).toHaveBeenCalledWith(
            expect.objectContaining({
                behavior: "auto",
            })
        );
    });
});