import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Connexion from "./Connexion";

describe("Connexion", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            headers: {
                get: () => "application/json",
            },
            json: async () => ({ message: "Connexion réussie." }),
        } as unknown as Response);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const fillLoginFields = async () => {
        await user.type(screen.getByLabelText(/email/i), "test@example.com");
        await user.type(screen.getByLabelText(/mot de passe/i), "password123");
    };

    const switchToRegister = async () => {
        await user.click(screen.getByRole("button", { name: /s'inscrire/i }));
    };

    const fillRegisterFields = async () => {
        await user.type(screen.getByLabelText(/email/i), "newuser@example.com");
        await user.type(screen.getByLabelText(/mot de passe/i), "password123");
        await user.type(screen.getByLabelText(/prénom/i), "Jean");
        await user.type(screen.getByLabelText(/^nom$/i), "Dupont");
        await user.type(screen.getByLabelText(/téléphone/i), "0600000000");
    };

    it("affiche les champs de base en mode login", () => {
        render(<Connexion />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /me connecter/i })).toBeInTheDocument();
    });

    it("affiche les champs supplémentaires en mode inscription", async () => {
        render(<Connexion />);

        await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

        expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();
    });

    it("affiche une erreur si email ou mot de passe sont manquants", async () => {
        render(<Connexion />);

        await user.click(screen.getByRole("button", { name: /me connecter/i }));

        expect(
            await screen.findByText(/email et mot de passe sont obligatoires/i),
        ).toBeInTheDocument();
    });

    it("envoie une requête de connexion valide et affiche un message de succès", async () => {
        render(<Connexion />);

        await fillLoginFields();
        await user.click(screen.getByRole("button", { name: /me connecter/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        expect(
            await screen.findByText(/connexion réussie\.|connexion réussie/i),
        ).toBeInTheDocument();
    });

    it("gère une réponse d'erreur du serveur", async () => {
        (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            status: 400,
            statusText: "Bad Request",
            headers: {
                get: () => "application/json",
            },
            json: async () => ({ message: "Erreur lors de la connexion." }),
        } as unknown as Response);

        render(<Connexion />);

        await fillLoginFields();
        await user.click(screen.getByRole("button", { name: /me connecter/i }));

        expect(
            await screen.findByText(/erreur lors de la connexion/i),
        ).toBeInTheDocument();
    });

    it("valide les champs requis en mode inscription", async () => {
        render(<Connexion />);

        await switchToRegister();

        await fillLoginFields();

        await user.click(screen.getByRole("button", { name: /m'inscrire/i }));

        expect(
            await screen.findByText(/nom et prénom sont recommandés pour l'inscription/i),
        ).toBeInTheDocument();
    });

    it("envoie une requête d'inscription valide et affiche un message de succès", async () => {
        (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            status: 201,
            statusText: "Created",
            headers: {
                get: () => "application/json",
            },
            json: async () => ({ message: "Inscription réussie." }),
        } as unknown as Response);

        render(<Connexion />);

        await switchToRegister();
        await fillRegisterFields();
        await user.click(screen.getByRole("button", { name: /m'inscrire/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        expect(
            await screen.findByText(/inscription réussie\.|inscription réussie/i),
        ).toBeInTheDocument();
    });

    it("gère une réponse non-json du serveur", async () => {
        (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            status: 500,
            statusText: "Internal Server Error",
            headers: {
                get: () => "text/html",
            },
            json: async () => {
                throw new Error("Should not be called");
            },
        } as unknown as Response);

        render(<Connexion />);

        await fillLoginFields();
        await user.click(screen.getByRole("button", { name: /me connecter/i }));

        expect(
            await screen.findByText(/erreur serveur: 500 internal server error/i),
        ).toBeInTheDocument();
    });

    it("permet d'afficher/masquer le mot de passe", async () => {
        render(<Connexion />);

        const passwordInput = screen.getByLabelText(/mot de passe/i) as HTMLInputElement;
        const toggleButton = screen.getByRole("button", { name: /afficher/i });

        expect(passwordInput.type).toBe("password");
        await user.click(toggleButton);
        expect(passwordInput.type).toBe("text");
    });

    it("gère une réponse d'erreur du serveur lors de l'inscription", async () => {
        (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            status: 400,
            statusText: "Bad Request",
            headers: {
                get: () => "application/json",
            },
            json: async () => ({ message: "Erreur lors de l'inscription." }),
        } as unknown as Response);

        render(<Connexion />);

        await switchToRegister();
        await fillRegisterFields();
        await user.click(screen.getByRole("button", { name: /m'inscrire/i }));

        expect(
            await screen.findByText(/erreur lors de l'inscription/i),
        ).toBeInTheDocument();
    });

    it("gère une réponse non-json du serveur lors de l'inscription", async () => {
        (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            status: 500,
            statusText: "Internal Server Error",
            headers: {
                get: () => "text/html",
            },
            json: async () => {
                throw new Error("Should not be called");
            },
        } as unknown as Response);

        render(<Connexion />);

        await switchToRegister();
        await fillRegisterFields();
        await user.click(screen.getByRole("button", { name: /m'inscrire/i }));

        expect(
            await screen.findByText(/erreur serveur: 500 internal server error/i),
        ).toBeInTheDocument();
    });
});
