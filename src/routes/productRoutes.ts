import { Router } from "express"
import productController from "../controllers/productController"
import authMiddleware from "../middleware/authMiddleware"

const productRouter = Router()



productRouter.get("/", productController.getAllProducts)

productRouter.get("/:id", productController.getProductById)

productRouter.post("/", authMiddleware, productController.addProduct)

productRouter.delete("/:id", authMiddleware, productController.deleteProduct)

productRouter.patch("/:id", authMiddleware, productController.updateProduct)




export default productRouter