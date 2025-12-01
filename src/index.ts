
import express from "express"
import cors from "cors"
import { connectDB } from "./config/mongodb"
import productRouter from "./routes/productRoutes"
import authRoute from "./routes/authRoutes"
import morgan from "morgan"
import logger from "./config/logger"
// import limiter from "./middleware/rateLimitMiddleware"
import dotenv from "dotenv"
import transporter from "./config/emailConfig"
import createTemplate from "./templates/emailTemplate"


dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

const PORT = process.env.PORT

const app = express()

//middlewares
app.use(cors())
app.use(express.json())

app.use(morgan("dev"))
app.use(logger)


app.get("/", (__, res) => {
  res.json({ status: true })
})

app.use("/auth", authRoute)

app.use("/products", productRouter)

app.post("/email/send", async (req, res) => {
  const { email: emailUser, subject, message } = req.body

  if (!subject || !emailUser || !message) {
    return res.status(400).json({ success: false, error: "debes completar todos los campos" })
  }

  try {
    const info = await transporter.sendMail({
      from: `Tienda de software ${emailUser}`,
      to: process.env.EMAIL_USER,
      replyTo: emailUser,
      subject,
      html: createTemplate(emailUser, message)
    })

    res.json({ success: true, message: "Correo enviado de forma exitosa", info })

  } catch (e) {
    const error = e as Error
    console.error("Error enviando correo:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.use((__, res) => {
  res.status(404).json({ error: "El recurso no se encuentra" })
})

app.listen(PORT, () => {
  connectDB()
  console.log(`✅ Servidor en escucha en el puerto http://localhost:${PORT}`)
})