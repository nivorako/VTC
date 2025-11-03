// api/contact.js - Vercel serverless function
import nodemailer from "nodemailer";

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { name, email, message, phone, clientType, requestType } =
            req.body;

        if (
            !name ||
            !email ||
            !message ||
            !phone ||
            !clientType ||
            !requestType
        ) {
            return res
                .status(400)
                .json({ message: "Tous les champs sont requis." });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        // Define email options
        const mailOptions = {
            from: `"VTC-Project" <${process.env.GMAIL_USER}>`,
            to: process.env.RECIPIENT_EMAIL,
            subject: `Nouveau message de ${name}`,
            text: `Vous avez reçu un nouveau message depuis votre formulaire de contact.\n\nType de client: ${clientType}\nNom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nType(s) de demande: ${requestType.join(", ")}\n\nMessage:\n${message}`,
            html: `<h2>Nouveau message de contact</h2>
             <h3>Détails du contact</h3>
             <ul>
               <li><strong>Type de client:</strong> ${clientType}</li>
               <li><strong>Nom:</strong> ${name}</li>
               <li><strong>Email:</strong> ${email}</li>
               <li><strong>Téléphone:</strong> ${phone}</li>
               <li><strong>Type(s) de demande:</strong> ${requestType.join(", ")}</li>
             </ul>
             <h3>Message</h3>
             <p>${message}</p>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Message envoyé avec succès !" });
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail:", error);
        res.status(500).json({
            message: "Une erreur est survenue lors de l'envoi de l'e-mail.",
            error:
                error instanceof Error ? error.toString() : "Erreur inconnue",
        });
    }
}
