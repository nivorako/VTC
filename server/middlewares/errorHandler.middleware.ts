import type { Request, Response, NextFunction } from "express";

/**
 * Middleware global de gestion des erreurs.
 * 
 * Journalise l'erreur et renvoie une réponse JSON 500 générique.
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Server error:", err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: err.message || "Une erreur interne est survenue",
    });
};
