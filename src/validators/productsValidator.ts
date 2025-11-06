import { z } from "zod"



const productCreateSchema = z.object({
  name: z.string().min(4),
  description: z.string().min(20),
  stock: z.number().min(0),
  category: z.string().min(4),
  price: z.number().min(10).positive(),
})

export const productSchemaValidator = productCreateSchema

export const updateSchemaValidator = productSchemaValidator.partial()