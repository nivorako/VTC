import type { Request, Response } from "express";
import nodemailer from "nodemailer";

interface ContactRequestBody {
    name: string;
    email: string;
    message: string;
    phone: string;
    clientType: string;
    requestType: string[];
}

/**
 * Envoie un email à partir du formulaire de contact.
 * Cette fonction traite les requêtes POST envoyées à l'adresse /api/contact.
 * Elle est accessible publiquement.
 *
 * @route   POST /api/contact
 * @access  Public
 */
export const sendEmail = async (req: Request, res: Response) => {
    try {
        const { name, email, message, phone, clientType, requestType } =
            req.body as ContactRequestBody;

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

        // 1. Create a transporter
        // NOTE: You need to add these variables to your .env file in the /server directory
        // For Gmail SMTP (production ready)
        // GMAIL_USER=your-gmail-address@gmail.com
        // GMAIL_PASS=your-app-password (not your regular password)
        // RECIPIENT_EMAIL=the-email-address-to-receive-messages@example.com
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        // Verify connection configuration
        transporter.verify(function (error: Error | null) {
            if (error) {
                console.log("Gmail connection error:", error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        // 2. Define email options
        const mailOptions = {
            from: `"VTC-Project" <${process.env.GMAIL_USER}>`, // sender address (must be your Gmail)
            to: process.env.RECIPIENT_EMAIL, // list of receivers
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

        // 3. Send the email
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
};
