import { useState } from "react";
import styled from "styled-components";
import backgroundIMG from "../assets/voiture.webp";

const ConnexionSection = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

const FormCard = styled.form`
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 420px;
    padding: 2rem;
    background: #ffffff;
    color: #222;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const Title = styled.h1`
    position: relative;
    z-index: 2;
    margin-bottom: 1.5rem;
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 600;
`;

const InputWrapper = styled.div`
    position: relative;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.8rem 1rem;
    border-radius: 6px;
    border: 1px solid #d0d7de;
    background: #f5f8fa;
    font-size: 0.95rem;
    color: #111827;
    box-sizing: border-box;
`;

const PasswordToggle = styled.button`
    position: absolute;
    right: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 0.85rem;
    color: #4b5563;
`;

const ForgotPassword = styled.button`
    align-self: flex-end;
    border: none;
    background: transparent;
    color: #4b5563;
    font-size: 0.85rem;
    cursor: pointer;
`;

const PrimaryButton = styled.button`
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 6px;
    border: none;
    background: #111827;
    color: #ffffff;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    margin-top: 0.5rem;
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const SecondaryLink = styled.button`
    margin-top: 0.75rem;
    align-self: center;
    border: none;
    background: transparent;
    color: #111827;
    font-size: 0.9rem;
    cursor: pointer;
`;

const ErrorMessage = styled.p`
    color: #b91c1c;
    font-size: 0.85rem;
`;

const SuccessMessage = styled.p`
    color: #15803d;
    font-size: 0.85rem;
`;

type Mode = "login" | "register";

export default function Connexion() {
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const apiBase = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/auth`
        : "/api/auth";

    const isLogin = mode === "login";

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Email et mot de passe sont obligatoires.");
            return;
        }

        if (!isLogin && !firstName && !lastName) {
            setError("Nom et prénom sont recommandés pour l'inscription.");
            return;
        }

        setLoading(true);

        try {
            const endpoint = isLogin ? "login" : "register";
            const response = await fetch(`${apiBase}/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    isLogin
                        ? { email, password }
                        : { email, password, firstName, lastName, phone }
                ),
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
                        (isLogin
                            ? "Erreur lors de la connexion."
                            : "Erreur lors de l'inscription.")
                );
            }

            setSuccess(result.message || (isLogin ? "Connexion réussie." : "Inscription réussie."));

            if (isLogin) {
                // TODO: stocker les infos user / token quand tu mettras en place la session
            } else {
                // Après inscription, basculer en mode login
                setMode("login");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Une erreur inconnue est survenue."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConnexionSection>
            <Title>Connexion</Title>
            <FormCard onSubmit={handleSubmit}>
                <FieldGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FieldGroup>

                <FieldGroup>
                    <Label htmlFor="password">Mot de passe</Label>
                    <InputWrapper>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <PasswordToggle
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? "Masquer" : "Afficher"}
                        </PasswordToggle>
                    </InputWrapper>
                </FieldGroup>

                {!isLogin && (
                    <>
                        <FieldGroup>
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </FieldGroup>
                    </>
                )}

                <ForgotPassword type="button">Mot de passe oublié ?</ForgotPassword>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <PrimaryButton type="submit" disabled={loading}>
                    {loading
                        ? isLogin
                            ? "Connexion en cours..."
                            : "Inscription en cours..."
                        : isLogin
                          ? "Me connecter"
                          : "M'inscrire"}
                </PrimaryButton>

                <SecondaryLink
                    type="button"
                    onClick={() => {
                        setMode((prev) => (prev === "login" ? "register" : "login"));
                        setError("");
                        setSuccess("");
                    }}
                >
                    {isLogin ? "S'inscrire" : "J'ai déjà un compte"}
                </SecondaryLink>
            </FormCard>
        </ConnexionSection>
    );
}
