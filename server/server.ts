// server/server.ts
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file in the server directory
const envPathFromServer = path.resolve(__dirname, "..", "..", "server", ".env");
const envPathFromCwd = path.resolve(process.cwd(), ".env");
const envPathFromDist = path.resolve(__dirname, "..", ".env");

let envPath: string;
if (fs.existsSync(envPathFromServer)) {
    envPath = envPathFromServer; // server/.env (prioritaire)
} else if (fs.existsSync(envPathFromCwd)) {
    envPath = envPathFromCwd; // racine/.env
} else {
    envPath = envPathFromDist; // dist/.env
}

console.log("Loading .env from:", envPath);
dotenv.config({ path: envPath });

import express from "express";
import cors from "cors";

// Import configurations and initializers
import connectDB from "./config/db.js";

// Import middlewares
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

// Import routes
import paymentRoutes from "./routes/payment.routes.js";
import contactRoutes from "./routes/contact.routes.js";

// Connect to the database
connectDB();

const app = express();
const port = process.env.PORT || 4001;

// --- Middlewares ---

// CORS middleware to allow cross-origin requests
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://vtc-client.onrender.com",
    /^http:\/\/localhost:\d+$/, // any localhost port
    /^http:\/\/127\.0\.0\.1:\d+$/, // any 127.0.0.1 port
    /^https:\/\/.*\.vercel\.app$/, // Vercel subdomains
    /^https:\/\/.*\.vercel\.com$/, // Vercel custom domains
];

const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
        // allow non-browser tools with no origin (e.g., Postman)
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.some((o) =>
            typeof o === "string" ? o === origin : o.test(origin)
        );
        return isAllowed
            ? callback(null, true)
            : callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Explicitly enable preflight across-the-board
app.options("*", cors(corsOptions));

// Middleware to parse JSON bodies. This is crucial for handling POST requests.
app.use(express.json());

// --- API Routes ---

// Root route to confirm API is working
app.get("/", (req, res) => {
    res.json({
        message: "VTC API Server is running",
        status: "OK",
        endpoints: {
            contact: "/api/contact",
            payments: "/api/payments",
        },
    });
});

// Mount the payment routes under the /api/payments prefix
app.use("/api/payments", paymentRoutes);

// Mount the contact routes under the /api prefix
app.use("/api", contactRoutes);

// --- Global Error Handler ---

// This must be the last middleware to be used
app.use(errorHandler);

// --- Start Server ---

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
