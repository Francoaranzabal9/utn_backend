import { connect } from "mongoose"
import dotenv from "dotenv"
import { getEnv } from "./env"

dotenv.config()

const { URI_DB } = getEnv()
console.log(URI_DB)
const connectDB = async () => {
  try {
    await connect(URI_DB as string)
    console.log("✅ Conectado a mongoDB")
  } catch (e) {
    console.log("Error al conectarse a mongoDB")
    process.exit(1)
  }
}

export { connectDB }