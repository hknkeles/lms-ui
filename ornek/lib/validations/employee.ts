import * as z from 'zod'

export const employeeSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Ad en az 2 karakter olmalı')
    .max(50, 'Ad en fazla 50 karakter olabilir'),
  lastName: z
    .string()
    .min(2, 'Soyad en az 2 karakter olmalı')
    .max(50, 'Soyad en fazla 50 karakter olabilir'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  phone: z.string().min(10, 'Telefon numarası en az 10 karakter olmalı'),
  sicil: z.string().min(1, 'Sicil numarası gerekli'),
  unvan: z.string().min(1, 'Ünvan gerekli'),
  kadro: z.string().min(1, 'Kadro seçin'),
  adliye: z.string().min(1, 'Adliye seçin'),
  birim: z.string().min(1, 'Birim seçin'),
  birthDate: z.date({
    required_error: 'Doğum tarihi gerekli',
  }),
  startDate: z.date({
    required_error: 'Başlangıç tarihi gerekli',
  }),
  status: z.enum(['active', 'temporary_duty', 'unpaid_leave', 'sick_leave', 'transferred', 'resigned', 'retired', 'terminated'], {
    required_error: 'Durum seçin',
  }),
  separationDate: z.date().optional(),
  separationReason: z.string().optional(),
  tags: z.array(z.string()).min(1, 'En az bir etiket seçin'),
  avatar: z.any().optional(),
  notes: z.string().optional(),
  temporaryDutyLocation: z.string().optional(),
  temporaryDutyEndDate: z.date().optional(),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
