import { z } from "zod";

export const createSupplierSchema = z.object({
  restaurantId: z.string().min(1),
  branchId: z.string().optional(),

  name: z.string().min(2).max(150),

  companyName: z.string().max(150).optional(),

  email: z.string().email().optional(),

  phone: z.string().min(5).max(20),

  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(20).optional(),

  gstNumber: z.string().max(30).optional(),

  contactPerson: z.string().max(150).optional(),

  notes: z.string().max(1000).optional(),
});

export const updateSupplierSchema = createSupplierSchema
  .omit({
    restaurantId: true,
  })
  .partial();

export const supplierStatusSchema = z.object({
  isActive: z.boolean(),
});