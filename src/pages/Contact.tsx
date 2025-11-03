import backgroundIMG from "../assets/voiture.webp";
import styled from "styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../components/Button";

// Schéma de validation Yup
const schema = yup.object().shape({
    clientType: yup
        .string()
        .required("Veuillez sélectionner un type de client"),
    name: yup.string().required("Le nom est requis"),
    email: yup
        .string()
        .email("Format d'email invalide")
        .required("L'email est requis"),
    phone: yup.string().required("Le téléphone est requis"),
    requestType: yup
        .array(yup.string().required())
        .min(1, "Veuillez sélectionner au moins un type de demande")
        .required(),
    message: yup.string().required("Le message est requis"),
});

type FormData = yup.InferType<typeof schema>;

/**
 * Formulaire de contact pour envoyer un message à l'équipe.
 * Le formulaire est composé de champs pour le type de client, le nom, l'email, le téléphone et le type de demande.
 * Les erreurs sont affichées en dessous des chaque champ.
 * Lorsque le formulaire est envoyé avec succès, un message de réussite est affiché et le formulaire est réinitialisé.
 * Si une erreur se produit lors de l'envoi du formulaire, un message d'erreur est affiché.
 */
export default function Contact() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    /**
     * Envoie le formulaire de contact avec les données du formulaire.
     *
     * @param {FormData} data - Les données du formulaire, incluant le type de client, le nom, l'email, le téléphone et le type de demande.
     *
     * @throws {Error} - Si une erreur se produit lors de l'envoi du formulaire, un objet Error est levé avec un message d'erreur.
     */
    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            // Use different API endpoints for different environments
            const apiUrl = import.meta.env.VITE_API_URL
                ? `${import.meta.env.VITE_API_URL}/api/contact` // For Render deployment or local dev
                : "/api/contact"; // For Vercel serverless functions

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(
                    `Erreur serveur: ${response.status} ${response.statusText}`
                );
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Une erreur est survenue lors de l'envoi du message."
                );
            }

            setSuccessMessage(result.message);
            reset(); // Réinitialise le formulaire après un envoi réussi
            console.log("Envoi réussi, data : ", data);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Une erreur inconnue est survenue."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContactSection>
            <H1>Contact</H1>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                    <Label>Vous êtes un :</Label>
                    <CheckboxGroup>
                        <CheckboxLabel>
                            <input
                                type="radio"
                                value="privé"
                                {...register("clientType")}
                            />
                            Privé
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="radio"
                                value="particulier"
                                {...register("clientType")}
                            />
                            Particulier
                        </CheckboxLabel>
                    </CheckboxGroup>
                    {errors.clientType && (
                        <ErrorMessage>{errors.clientType.message}</ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && (
                        <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...register("email")} />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && (
                        <ErrorMessage>{errors.phone.message}</ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label>Type de demande :</Label>
                    <CheckboxGroup>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                value="Longue distance"
                                {...register("requestType")}
                            />
                            Longue distance
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                value="Rapatriement"
                                {...register("requestType")}
                            />
                            Rapatriement
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                value="Évènement"
                                {...register("requestType")}
                            />
                            Évènement
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <input
                                type="checkbox"
                                value="Transfert"
                                {...register("requestType")}
                            />
                            Transfert gare/aéroport
                        </CheckboxLabel>
                    </CheckboxGroup>
                    {errors.requestType && (
                        <ErrorMessage>
                            {errors.requestType.message}
                        </ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="message">Votre message</Label>
                    <Textarea id="message" {...register("message")} />
                    {errors.message && (
                        <ErrorMessage>{errors.message.message}</ErrorMessage>
                    )}
                </FormGroup>

                {successMessage && (
                    <SuccessMessage>{successMessage}</SuccessMessage>
                )}
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

                <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    disabled={loading}
                >
                    {loading ? "Envoi en cours..." : "Envoyer"}
                </Button>
            </FormContainer>
        </ContactSection>
    );
}

const ContactSection = styled.section`
    background-image: url(${backgroundIMG});
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    box-sizing: border-box;
    margin: 0 auto;
    color: white;
    position: relative;
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
    }
`;

const H1 = styled.h1`
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 40px;
`;

const FormContainer = styled.form`
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
    width: 100%;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: #f1f1f1;
    color: #333;
    box-sizing: border-box;
`;

const Textarea = styled.textarea`
    width: 100%;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    min-height: 150px;
    background: #f1f1f1;
    color: #333;
    box-sizing: border-box;
`;

const CheckboxGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
`;

const ErrorMessage = styled.p`
    color: #ff4d4d;
    margin-top: 0.5rem;
    font-size: 0.875rem;
`;

const SuccessMessage = styled.p`
    color: #4caf50;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    font-weight: bold;
`;
