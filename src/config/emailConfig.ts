import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const USER = process.env.EMAIL_USER
const PASS = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: USER,
    pass: PASS
  },
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 10000, // 10 seconds
  debug: true, // Enable debug output
  logger: true // Log information to console
})

transporter.verify().then(() => {
  console.log("✅ Nodemailer está listo para enviar correos");
}).catch((error) => {
  console.error("❌ Error configurando Nodemailer:", error);
});

export default transporter