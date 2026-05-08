import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Autoriser seulement POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Récupération des données envoyées depuis le frontend
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    // Configuration SMTP (Gmail ou email pro)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "support@kalsholding.com", // ton email
        pass: process.env.EMAIL_PASS,    // mot de passe Vercel (App Password)
      },
    });

    // Contenu du mail
    const mailOptions = {
      from: `"Site KALS HOLDING" <${email}>`,
      to: "support@kalsholding.com",
      subject: subject || "Nouveau message depuis le site",
      text: `
Nouveau message reçu :

Nom: ${name}
Email: ${email}
Sujet: ${subject || "Sans sujet"}

Message:
${message}
      `,
    };

    // Envoi email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ status: "OK" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erreur serveur lors de l'envoi",
    });
  }
}