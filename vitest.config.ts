import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    server: {
        proxy: {
            "/api": {
                target: "http://localhost:4001",
                changeOrigin: true,
                secure: false,
            },
        },
    },

    build: {
        outDir: "dist",
        sourcemap: false,
    },

    test: {
        // Environnement de test pour React
        environment: "jsdom",

        // Globals pour ne pas avoir à importer describe, it, expect, etc.
        globals: true,

        // Setup files exécutés avant chaque fichier de test
        setupFiles: ["./src/tests/setup.ts"],

        // Coverage configuration
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                "node_modules/",
                "dist/",
                "server/",
                "**/*.config.ts",
                "**/*.config.js",
                "**/tests/**",
                "**/*.d.ts",
            ],
        },

        // Inclure les fichiers de test
        include: [
            "src/**/*.{test,spec}.{ts,tsx}",
            "src/tests/**/*.{test,spec}.{ts,tsx}",
        ],

        // Exclure certains dossiers
        exclude: ["node_modules", "dist", "server", ".idea", ".git", ".cache"],

        // Transformations pour les fichiers non-JS
        css: true,
    },
});
