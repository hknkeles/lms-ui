import * as z from 'zod'

export const loginSchema = z.object({
  userId: z
    .string()
    .min(1, 'Kullanıcı ID gerekli')
    .regex(/^\d{1,6}$/, '6 haneli sayı girin'),
  password: z
    .string()
    .min(1, 'Şifre gerekli')
    .min(6, 'Şifre en az 6 karakter olmalı'),
})

export type LoginFormData = z.infer<typeof loginSchema>
