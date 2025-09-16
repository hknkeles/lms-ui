export interface Employee {
  id: string
  sicil: string
  firstName: string
  lastName: string
  email: string
  phone: string
  unvan: string
  kadro: string
  adliye: string
  birim: string
  startDate: string
  status: 'active' | 'temporary_duty' | 'unpaid_leave' | 'sick_leave' | 'transferred' | 'resigned' | 'retired' | 'terminated'
  separationDate?: string
  separationReason?: string
  tags: string[]
  avatar?: string
  address?: string
  notes?: string
  salary?: number
  manager?: string
  temporaryDutyLocation?: string
  temporaryDutyEndDate?: string
}

export interface EmployeeFilters {
  search: string
  birim: string
  status: string
  adliye: string
  kadro: string
}

export interface BulkAction {
  type: 'add_tag' | 'remove_tag' | 'change_status'
  value: string
  employeeIds: string[]
}
