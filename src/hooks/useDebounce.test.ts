import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useDebounce from "./useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
        // Utiliser les vrais timers
        vi.useRealTimers();
    });

    afterEach(() => {
        // Nettoyer après chaque test
        vi.clearAllTimers();
    });

    it("devrait retourner la valeur initiale immédiatement", () => {
        const { result } = renderHook(() => useDebounce("initial", 500));

        // La valeur initiale doit être retournée immédiatement
        expect(result.current).toBe("initial");
    });

    it("devrait debouncer la valeur après le délai spécifié", async () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: "initial", delay: 500 },
            }
        );

        // Valeur initiale
        expect(result.current).toBe("initial");

        // Changer la valeur
        rerender({ value: "updated", delay: 500 });

        // La valeur ne devrait pas changer immédiatement
        expect(result.current).toBe("initial");

        // Attendre que le délai soit écoulé
        await waitFor(
            () => {
                expect(result.current).toBe("updated");
            },
            { timeout: 600 }
        );
    });

    it("devrait reset le timer lors de changements multiples", async () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: "initial", delay: 500 },
            }
        );

        // Valeur initiale
        expect(result.current).toBe("initial");

        // Premier changement
        rerender({ value: "first", delay: 500 });
        expect(result.current).toBe("initial");

        // Attendre un peu mais pas le délai complet
        await new Promise((resolve) => setTimeout(resolve, 250));

        // Deuxième changement avant que le délai soit écoulé
        rerender({ value: "second", delay: 500 });
        expect(result.current).toBe("initial");

        // Attendre un peu mais pas le délai complet
        await new Promise((resolve) => setTimeout(resolve, 250));

        // Troisième changement avant que le délai soit écoulé
        rerender({ value: "third", delay: 500 });
        expect(result.current).toBe("initial");

        // Attendre que le délai soit écoulé
        await waitFor(
            () => {
                expect(result.current).toBe("third");
            },
            { timeout: 600 }
        );

        // Seule la dernière valeur devrait être présente
        expect(result.current).toBe("third");
    });

    it("devrait fonctionner avec différents types de données", async () => {
        // Test avec un nombre
        const { result: numberResult, rerender: numberRerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 0, delay: 300 },
            }
        );

        expect(numberResult.current).toBe(0);
        numberRerender({ value: 42, delay: 300 });

        await waitFor(
            () => {
                expect(numberResult.current).toBe(42);
            },
            { timeout: 400 }
        );

        // Test avec un objet
        const initialObj = { name: "test" };
        const updatedObj = { name: "updated" };
        const { result: objResult, rerender: objRerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: initialObj, delay: 300 },
            }
        );

        expect(objResult.current).toEqual(initialObj);
        objRerender({ value: updatedObj, delay: 300 });

        await waitFor(
            () => {
                expect(objResult.current).toEqual(updatedObj);
            },
            { timeout: 400 }
        );
    });

    it("devrait changer le délai dynamiquement", async () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: "initial", delay: 500 },
            }
        );

        // Changer la valeur avec un délai court
        rerender({ value: "updated", delay: 200 });

        // La valeur devrait changer plus rapidement avec le délai court
        await waitFor(
            () => {
                expect(result.current).toBe("updated");
            },
            { timeout: 300 }
        );
    });

    it("devrait nettoyer le timeout lors du démontage", () => {
        const { unmount } = renderHook(() => useDebounce("test", 500));

        // Le démontage ne devrait pas causer d'erreur
        expect(() => unmount()).not.toThrow();
    });
});
