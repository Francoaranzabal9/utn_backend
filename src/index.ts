
import express from "express"
import cors from "cors"
import { connectDB } from "./config/mongodb"
import productRouter from "./routes/productRoutes"
import authRoute from "./routes/authRoutes"
import morgan from "morgan"
import logger from "./config/logger"
import limiter from "./middleware/rateLimitMiddleware"
import authMiddleware from "./middleware/authMiddleware"
import dotenv from "dotenv"

dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

//credenciales
// const PORT = 2222


const PORT = process.env.PORT

//funcion que conecta la base de datos 

const app = express()

//middlewares
app.use(cors())
app.use(express.json())

app.use(morgan("dev"))
app.use(logger)


app.get("/", (__, res) => {
  res.json({ status: true })
})

app.use("/auth", limiter, authRoute)
app.use("/products", authMiddleware, productRouter)


app.use((__, res) => {
  res.status(404).json({ error: "El recurso no se encuentra" })
})

app.listen(PORT, () => {
  connectDB()
  console.log(`✅ Servidor en escucha en el puerto http://localhost:${PORT}`)
})