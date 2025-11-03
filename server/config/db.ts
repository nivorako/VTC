// config/db.ts
import mongoose from "mongoose";

// Variable exportée pour suivre l'état de la connexion
export let isMongoConnected = false;

/**
 * Établit la connexion à la base de données MongoDB.
 *
 * @returns true si la connexion a réussi, false sinon
 */
const connectDB = async (): Promise<boolean> => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn(
                "Variable d'environnement MONGO_URI non définie. La connexion à la base de données sera ignorée."
            );
            isMongoConnected = false;
            return false;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connecté: ${conn.connection.host}`);
        isMongoConnected = true;
        return true;
    } catch (error) {
        console.error(
            `Erreur de connexion à MongoDB: ${error instanceof Error ? error.message : "Erreur inconnue"}`
        );
        console.error(
            `URI MongoDB utilisée (masquée): ${process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:\/\/([^:]+):([^@]+)@/, "://****:****@") : "non définie"}`
        );
        console.warn(
            "Le serveur continuera à fonctionner sans connexion à la base de données."
        );
        isMongoConnected = false;
        return false;
    }
};

export default connectDB;
