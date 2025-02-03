import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import * as nodemailer from 'nodemailer';
import { defineSecret } from 'firebase-functions/params';

const EMAIL_USER = defineSecret('EMAIL_USER');
const EMAIL_PASS = defineSecret('EMAIL_PASS');


initializeApp();
const db = getFirestore();

// Send Email Code Function (V2)
export const sendEmailCode = onRequest(
    { timeoutSeconds: 30, secrets: [EMAIL_USER, EMAIL_PASS] },
    async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ error: 'No email provided' });
                return;
            }

            // Generate a 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Set an expiration time for the code (5 minutes from now)
            const expiresAt = Date.now() + 5 * 60 * 1000;

            // Store in Firestore (collection: emailCodes, doc: email)
            await db.collection('emailCodes').doc(email).set({ code, expiresAt });

            const user = EMAIL_USER.value();
            const pass = EMAIL_PASS.value();

            // Create Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user,
                    pass,
                },
            });

            // Email options
            const mailOptions = {
                from: `"Music-Academy" <${user}>`,
                to: email,
                subject: 'Your verification code',
                text: `Your code is: ${code}\n(It will expire in 5 minutes.)`,
            };

            // Send email
            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'Code sent successfully' });
        } catch (error) {
            console.error('sendEmailCode error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

export const verifyEmailCode = onRequest(async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            res.status(400).json({ error: 'Missing email or code' });
            return;
        }

        const docRef = db.collection('emailCodes').doc(email);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            res.status(400).json({ error: 'No code found for this email' });
            return;
        }

        const { code: storedCode, expiresAt } = docSnap.data() || {};

        // Check if the codes match
        if (storedCode !== code) {
            res.status(401).json({ error: 'Incorrect code' });
            return;
        }

        // Check if code is expired
        if (Date.now() > expiresAt) {
            res.status(401).json({ error: 'Code has expired' });
            return;
        }

        // Delete the doc so the code can't be reused
        await docRef.delete();

        res.status(200).json({ message: 'Code verified successfully' });
    } catch (error) {
        console.error('verifyEmailCode error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});