import { Request, Response } from "express"
import Product from "../model/ProductModel"
import { Types } from "mongoose"
import { productSchemaValidator, updateSchemaValidator } from "../validators/productsValidator"

class productController {
  static getAllProducts = async (req: Request, res: Response) => {
    try {

      const { name, stock, category, minPrice, maxPrice } = req.query

      const filter: any = {}

      if (name) filter.name = new RegExp(String(name), "i")
      if (stock) filter.stock = Number(stock)
      if (category) filter.category = new RegExp(String(category), "i")
      if (minPrice || maxPrice) {
        filter.price = {}

        if (minPrice) filter.price.$gte = minPrice

        if (maxPrice) filter.price.$lte = maxPrice
      }

      console.log(filter)

      const productList = await Product.find(filter)
      return res.json({ success: true, data: productList })
    } catch (e) {
      const error = e as Error
      return res.status(500).json({ success: false, error: error.message })
    }

  }

  static getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, error: "ID invalido" })

      const findedProduct = await Product.findById(id)

      if (!findedProduct) {
        return res.status(404).json({ success: false, message: "producto no encontrado" })
      }

      return res.status(200).json({ success: true, data: findedProduct })
    } catch (e) {
      return res.status(400).json({ success: false, error: "error al obtener el producto o el ID ingresado es invalido" })
    }
  }

  static addProduct = async (req: Request, res: Response) => {
    try {
      const { name, description, price, category, stock } = req.body

      if (!name || !price || !stock || !description || !category) {
        return res.status(400).json({ success: false, message: "todos los campos son requeridos" })
      }

      const existingProduct = await Product.findOne({ name })
      if (existingProduct) {
        return res.status(400).json({ success: false, message: "El producto ya existe" })
      }

      const validation = productSchemaValidator.safeParse(req.body)

      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error })
      }

      const newProduct = new Product(validation.data)

      await newProduct.save()
      return res.status(201).json({ success: true, data: newProduct })
    } catch (e) {
      return res.status(500).json({ success: false, error: "Error al crear el producto" })
    }
  }

  static updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const body = req.body

      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, error: "ID invalido" })

      const validation = updateSchemaValidator.safeParse(body)

      const updatedProduct = await Product.findByIdAndUpdate(id, validation.data, { new: true })

      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error })
      }

      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" })
      }

      return res.json({ success: true, data: updatedProduct })
    } catch (e) {
      return res.status(400).json({ success: false, error: "Error al actualizar el producto o el ID es inválido" })
    }
  }

  static deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, error: "ID invalido" })

      const deletedProduct = await Product.findByIdAndDelete(id)

      if (!deletedProduct) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" })
      }

      return res.json({ success: true, data: deletedProduct })
    } catch (e) {
      return res.status(400).json({ success: false, error: "Error al borrar el producto o el ID es inválido" })
    }
  }

}

export default productController