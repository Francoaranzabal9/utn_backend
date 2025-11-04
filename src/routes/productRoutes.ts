import { Router } from "express"
import authMiddleware from "../middleware/authMiddleware"
import productController from "../controllers/productController"

const productRouter = Router()



productRouter.get("/", authMiddleware, productController.getAllProducts)

productRouter.get("/:id", authMiddleware, productController.getProductById)

productRouter.post("/", authMiddleware, productController.addProduct)

productRouter.delete("/:id", authMiddleware, productController.deleteProduct)

productRouter.patch("/:id", authMiddleware, productController.updateProduct)




export default productRouter