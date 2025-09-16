import { Employee } from '../types/employee'

export const mockEmployees: Employee[] = [
  {
    id: '1',
    sicil: '123456',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@company.com',
    phone: '+90 532 123 4567',
    unvan: 'Senior Developer',
    kadro: 'Kadrolu',
    adliye: 'İstanbul Adliyesi',
    birim: 'Yazılım Geliştirme',
    startDate: '2022-03-15',
    status: 'active',
    tags: ['React', 'TypeScript', 'Team Lead'],
    salary: 25000,
    manager: 'Mehmet Özkan',
  },
  {
    id: '2',
    sicil: '234567',
    firstName: 'Fatma',
    lastName: 'Demir',
    email: 'fatma.demir@company.com',
    phone: '+90 312 987 6543',
    unvan: 'HR Manager',
    kadro: 'Kadrolu',
    adliye: 'Ankara Adliyesi',
    birim: 'İnsan Kaynakları',
    startDate: '2021-08-20',
    status: 'active',
    tags: ['Recruitment', 'Employee Relations', 'Training'],
    salary: 22000,
    manager: 'Ayşe Kaya',
  },
  {
    id: '3',
    sicil: '345678',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    email: 'mehmet.kaya@company.com',
    phone: '+90 232 456 7890',
    unvan: 'Sales Representative',
    kadro: 'Sözleşmeli',
    adliye: 'İzmir Adliyesi',
    birim: 'Satış',
    startDate: '2023-01-10',
    status: 'sick_leave',
    tags: ['B2B Sales', 'CRM', 'Customer Relations'],
    salary: 18000,
    manager: 'Can Arslan',
  },
  {
    id: '4',
    sicil: '456789',
    firstName: 'Ayşe',
    lastName: 'Özkan',
    email: 'ayse.ozkan@company.com',
    phone: '+90 212 345 6789',
    unvan: 'Senior Accountant',
    kadro: 'Kadrolu',
    adliye: 'İstanbul Adliyesi',
    birim: 'Muhasebe',
    startDate: '2020-11-05',
    status: 'active',
    tags: ['Financial Reporting', 'Tax', 'Audit'],
    salary: 20000,
    manager: 'Burak Şahin',
  },
  {
    id: '5',
    sicil: '567890',
    firstName: 'Can',
    lastName: 'Arslan',
    email: 'can.arslan@company.com',
    phone: '+90 212 567 8901',
    unvan: 'Marketing Director',
    kadro: 'Kadrolu',
    adliye: 'İstanbul Adliyesi',
    birim: 'Pazarlama',
    startDate: '2019-06-12',
    status: 'active',
    tags: ['Digital Marketing', 'Brand Strategy', 'Analytics'],
    salary: 35000,
    manager: 'Elif Yıldız',
  },
  {
    id: '6',
    sicil: '678901',
    firstName: 'Elif',
    lastName: 'Yıldız',
    email: 'elif.yildiz@company.com',
    phone: '+90 212 789 0123',
    unvan: 'Creative Director',
    kadro: 'Kadrolu',
    adliye: 'İstanbul Adliyesi',
    birim: 'Tasarım',
    startDate: '2021-02-28',
    status: 'active',
    tags: ['UI/UX Design', 'Brand Identity', 'Creative Direction'],
    salary: 28000,
    manager: 'Zeynep Korkmaz',
  },
  {
    id: '7',
    sicil: '789012',
    firstName: 'Burak',
    lastName: 'Şahin',
    email: 'burak.sahin@company.com',
    phone: '+90 312 234 5678',
    unvan: 'Tech Lead',
    kadro: 'Kadrolu',
    adliye: 'Ankara Adliyesi',
    birim: 'Yazılım Geliştirme',
    startDate: '2018-09-15',
    status: 'active',
    tags: ['Architecture', 'Team Leadership', 'Backend'],
    salary: 32000,
    manager: 'Mehmet Özkan',
  },
  {
    id: '8',
    sicil: '890123',
    firstName: 'Zeynep',
    lastName: 'Korkmaz',
    email: 'zeynep.korkmaz@company.com',
    phone: '+90 232 345 6789',
    unvan: 'Sales Manager',
    kadro: 'Sözleşmeli',
    adliye: 'İzmir Adliyesi',
    birim: 'Satış',
    startDate: '2022-05-20',
    status: 'temporary_duty',
    tags: ['Sales Management', 'Team Leadership', 'Strategy'],
    salary: 24000,
    manager: 'Can Arslan',
  },
  {
    id: '9',
    sicil: '901234',
    firstName: 'Deniz',
    lastName: 'Aydın',
    email: 'deniz.aydin@company.com',
    phone: '+90 212 456 7890',
    unvan: 'Frontend Developer',
    kadro: 'Geçici',
    adliye: 'İstanbul Adliyesi',
    birim: 'Yazılım Geliştirme',
    startDate: '2023-07-01',
    status: 'active',
    tags: ['React', 'Vue.js', 'CSS'],
    salary: 16000,
    manager: 'Ahmet Yılmaz',
  },
  {
    id: '10',
    sicil: '012345',
    firstName: 'Emre',
    lastName: 'Çelik',
    email: 'emre.celik@company.com',
    phone: '+90 312 345 6789',
    unvan: 'Content Specialist',
    kadro: 'Stajyer',
    adliye: 'Ankara Adliyesi',
    birim: 'Pazarlama',
    startDate: '2022-12-10',
    status: 'transferred',
    tags: ['Content Creation', 'Social Media', 'SEO'],
    salary: 15000,
    manager: 'Can Arslan',
  },
]

// LocalStorage helpers
export const saveEmployeesToStorage = (employees: Employee[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('employees', JSON.stringify(employees))
  }
}

export const loadEmployeesFromStorage = (): Employee[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('employees')
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return mockEmployees
}

export const getDepartments = (): string[] => {
  const departments = Array.from(new Set(mockEmployees.map((emp) => emp.birim)))
  return departments.sort()
}

export const getLocations = (): string[] => {
  const locations = Array.from(new Set(mockEmployees.map((emp) => emp.adliye)))
  return locations.sort()
}

export const getStatuses = (): string[] => {
  return ['active', 'temporary_duty', 'unpaid_leave', 'sick_leave', 'transferred']
}

export const getKadroTypes = (): string[] => {
  return ['Kadrolu', 'Sözleşmeli', 'Geçici', 'İşçi', 'Stajyer']
}
