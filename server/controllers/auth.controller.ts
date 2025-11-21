import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

interface RegisterRequestBody {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, phone } =
            req.body as RegisterRequestBody;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email et mot de passe sont obligatoires." });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res
                .status(409)
                .json({ message: "Un utilisateur avec cet email existe déjà." });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            email: email.toLowerCase(),
            firstName,
            lastName,
            phone,
            provider: "local",
            passwordHash,
            role: "user",
        });

        const { passwordHash: _ph, ...userSafe } = user.toObject();

        return res.status(201).json({
            message: "Inscription réussie.",
            user: userSafe,
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        return res.status(500).json({
            message: "Une erreur est survenue lors de l'inscription.",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as LoginRequestBody;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email et mot de passe sont obligatoires." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Identifiants invalides." });
        }

        if (user.provider !== "local") {
            return res.status(400).json({
                message:
                    "Ce compte est associé à une connexion externe (Google/Facebook). Utilisez ce mode de connexion.",
            });
        }

        if (!user.passwordHash) {
            return res
                .status(400)
                .json({ message: "Aucun mot de passe n'est défini pour ce compte." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Identifiants invalides." });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const { passwordHash: _ph, ...userSafe } = user.toObject();

        return res.status(200).json({
            message: "Connexion réussie.",
            user: userSafe,
        });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return res.status(500).json({
            message: "Une erreur est survenue lors de la connexion.",
        });
    }
};
