import type { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware.
 * It logs the error and sends a generic 500 internal server error response.
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
