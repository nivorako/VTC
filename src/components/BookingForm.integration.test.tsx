import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingForm, { type FormikValues } from "./BookingForm";

/**
 * Tests d'intégration pour BookingForm
 * 
 * Ce fichier teste:
 * - Validation de formulaire (tous les champs obligatoires)
 * - Soumission et synchronisation des données
 * - Gestion d'erreurs (messages de validation Yup)
 * - États de chargement et interactions utilisateur
 */

describe("BookingForm - Tests d'Intégration", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockOnFormChange: any;
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        mockOnFormChange = vi.fn();
        user = userEvent.setup();
    });

    // Helper function pour obtenir les inputs par leur name
    const getInputByName = (name: string) => {
        return document.querySelector(`[name="${name}"]`) as HTMLInputElement;
    };

    // ==========================================
    // 1. TESTS DE RENDU ET STRUCTURE
    // ==========================================
    describe("Rendu initial", () => {
        it("affiche le formulaire avec tous les champs", () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            // Vérifier que les champs principaux sont présents
            expect(getInputByName("depart")).toBeInTheDocument();
            expect(getInputByName("arrivee")).toBeInTheDocument();
            expect(getInputByName("date")).toBeInTheDocument();
            expect(getInputByName("heure")).toBeInTheDocument();
            expect(getInputByName("typeTrajet")).toBeInTheDocument();
        });

        it("contient tous les champs de formulaire nécessaires", () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            expect(getInputByName("date")).toBeInTheDocument();
            expect(getInputByName("heure")).toBeInTheDocument();
            expect(getInputByName("depart")).toBeInTheDocument();
            expect(getInputByName("arrivee")).toBeInTheDocument();
            expect(getInputByName("typeTrajet")).toBeInTheDocument();
        });

        it("initialise les valeurs par défaut correctement", () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            // Date doit être aujourd'hui
            const today = new Date().toISOString().split('T')[0];
            expect(getInputByName("date").value).toBe(today);

            // Heure doit être proche de l'heure actuelle (on vérifie juste qu'elle n'est pas vide)
            expect(getInputByName("heure").value).not.toBe("");

            // Lieux vides au départ
            expect(getInputByName("depart").value).toBe("");
            expect(getInputByName("arrivee").value).toBe("");

            // Type de trajet par défaut est "simple"
            expect(getInputByName("typeTrajet").value).toBe("simple");
        });
    });

    // ==========================================
    // 2. TESTS DE VALIDATION DE FORMULAIRE
    // ==========================================
    describe("Validation de formulaire", () => {
        it("affiche une erreur quand la date est vidée", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const dateInput = getInputByName("date");
            await user.clear(dateInput);
            await user.tab(); // blur

            await waitFor(() => {
                expect(screen.getByText(/date obligatoire/i)).toBeInTheDocument();
            });
        });

        it("affiche une erreur quand l'heure est vidée", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const heureInput = getInputByName("heure");
            await user.clear(heureInput);
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/heure obligatoire/i)).toBeInTheDocument();
            });
        });

        it("affiche une erreur quand le lieu de départ est manquant", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const departInput = getInputByName("depart");
            await user.click(departInput);
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/lieu de départ obligatoire/i)).toBeInTheDocument();
            });
        });

        it("affiche une erreur quand le lieu d'arrivée est manquant", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const arriveeInput = getInputByName("arrivee");
            await user.click(arriveeInput);
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/lieu d'arrivée obligatoire/i)).toBeInTheDocument();
            });
        });



        it("supprime les erreurs quand les champs sont correctement remplis", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const departInput = getInputByName("depart");

            // Déclencher l'erreur
            await user.click(departInput);
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/lieu de départ obligatoire/i)).toBeInTheDocument();
            });

            // Corriger l'erreur
            await user.type(departInput, "Paris");

            await waitFor(() => {
                expect(screen.queryByText(/lieu de départ obligatoire/i)).not.toBeInTheDocument();
            });
        });
    });

    // ==========================================
    // 3. TESTS DE SOUMISSION ET SYNCHRONISATION
    // ==========================================
    describe("Synchronisation des données", () => {
        it("appelle onFormChange avec les valeurs initiales au montage", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            await waitFor(() => {
                expect(mockOnFormChange).toHaveBeenCalled();
            });

            const lastCall = mockOnFormChange.mock.calls[mockOnFormChange.mock.calls.length - 1][0];
            const today = new Date().toISOString().split('T')[0];

            expect(lastCall.date).toBe(today);
            expect(lastCall.heure).not.toBe("");
            expect(lastCall.depart).toBe("");
            expect(lastCall.arrivee).toBe("");
            expect(lastCall.typeTrajet).toBe("simple");
        });

        it("synchronise les changements de champ texte", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const departInput = getInputByName("depart");
            await user.type(departInput, "Paris");

            await waitFor(() => {
                const calls = mockOnFormChange.mock.calls;
                const lastCall = calls[calls.length - 1][0] as FormikValues;
                expect(lastCall.depart).toBe("Paris");
            });
        });

        it("synchronise les changements de date et heure", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const dateInput = getInputByName("date");
            const heureInput = getInputByName("heure");

            await user.clear(dateInput);
            await user.type(dateInput, "2025-12-25");
            await user.clear(heureInput);
            await user.type(heureInput, "14:30");

            await waitFor(() => {
                const calls = mockOnFormChange.mock.calls;
                const lastCall = calls[calls.length - 1][0] as FormikValues;
                expect(lastCall.date).toBe("2025-12-25");
                expect(lastCall.heure).toBe("14:30");
            });
        });


        it("synchronise la sélection du type de trajet", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const typeTrajetSelect = getInputByName("typeTrajet");
            await user.selectOptions(typeTrajetSelect, "aller-retour");

            await waitFor(() => {
                const calls = mockOnFormChange.mock.calls;
                const lastCall = calls[calls.length - 1][0] as FormikValues;
                expect(lastCall.typeTrajet).toBe("aller-retour");
            });
        });
    });

    // ==========================================
    // 4. SCÉNARIO COMPLET DE BOUT EN BOUT
    // ==========================================
    describe("Scénario de remplissage complet", () => {
        it("permet de remplir un formulaire complet et valide", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            // Modifier les champs (date et heure ont déjà des valeurs par défaut)
            await user.clear(getInputByName("date"));
            await user.type(getInputByName("date"), "2025-12-25");
            await user.clear(getInputByName("heure"));
            await user.type(getInputByName("heure"), "14:30");
            await user.type(getInputByName("depart"), "Paris, Gare du Nord");
            await user.type(getInputByName("arrivee"), "Lyon, Part-Dieu");

            await user.selectOptions(getInputByName("typeTrajet"), "aller-retour");

            // Vérifier que les données sont correctement synchronisées
            await waitFor(() => {
                const calls = mockOnFormChange.mock.calls;
                const lastCall = calls[calls.length - 1][0] as FormikValues;

                expect(lastCall).toMatchObject({
                    date: "2025-12-25",
                    heure: "14:30",
                    depart: "Paris, Gare du Nord",
                    arrivee: "Lyon, Part-Dieu",
                    typeTrajet: "aller-retour",
                });
            });

            // Vérifier qu'aucune erreur n'est affichée
            expect(screen.queryByText(/obligatoire/i)).not.toBeInTheDocument();
        });

        it("permet de modifier des valeurs déjà saisies", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const departInput = getInputByName("depart");

            // Première saisie
            await user.type(departInput, "Paris");

            await waitFor(() => {
                const calls = mockOnFormChange.mock.calls;
                const lastCall = calls[calls.length - 1][0] as FormikValues;
                expect(lastCall.depart).toBe("Paris");
            });

            // Modification
            await user.clear(departInput);
            await user.type(departInput, "Marseille");

            await waitFor(() => {
                const calls = mockOnFormChange.mock.calls;
                const lastCall = calls[calls.length - 1][0] as FormikValues;
                expect(lastCall.depart).toBe("Marseille");
            });
        });

        it("gère les changements de type de trajet", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const typeTrajetSelect = getInputByName("typeTrajet");

            // Sélectionner "simple"
            await user.selectOptions(typeTrajetSelect, "simple");

            await waitFor(() => {
                const calls = mockOnFormChange.mock.calls;
                const lastCall = calls[calls.length - 1][0] as FormikValues;
                expect(lastCall.typeTrajet).toBe("simple");
            });

            // Changer pour "aller-retour"
            await user.selectOptions(typeTrajetSelect, "aller-retour");

            await waitFor(() => {
                const calls = mockOnFormChange.mock.calls;
                const lastCall = calls[calls.length - 1][0] as FormikValues;
                expect(lastCall.typeTrajet).toBe("aller-retour");
            });
        });
    });

    // ==========================================
    // 5. TESTS DE GESTION D'ERREURS MULTIPLES
    // ==========================================
    describe("Gestion d'erreurs multiples", () => {
        it("affiche plusieurs erreurs en même temps", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            // Vider plusieurs champs et toucher d'autres sans les remplir
            await user.clear(getInputByName("date"));
            await user.tab();
            await user.clear(getInputByName("heure"));
            await user.tab();
            await user.click(getInputByName("depart"));
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/date obligatoire/i)).toBeInTheDocument();
                expect(screen.getByText(/heure obligatoire/i)).toBeInTheDocument();
                expect(screen.getByText(/lieu de départ obligatoire/i)).toBeInTheDocument();
            });
        });
    });

    // ==========================================
    // 6. TESTS DE CAS LIMITES
    // ==========================================
    describe("Cas limites", () => {

        it("gère des adresses longues sans problème", async () => {
            render(<BookingForm onFormChange={mockOnFormChange} />);

            const longAddress =
                "123 Avenue des Champs-Élysées, 75008 Paris, France, Bâtiment A, Étage 3";
            const departInput = getInputByName("depart");

            await user.type(departInput, longAddress);

            await waitFor(() => {
                const calls = mockOnFormChange.mock.calls;
                const lastCall = calls[calls.length - 1][0] as FormikValues;
                expect(lastCall.depart).toBe(longAddress);
            });
        });
    });
});
