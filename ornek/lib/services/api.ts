const API_BASE_URL = 'http://localhost:5233/api';

export interface Personel {
  id: number;
  sicil: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  unvan?: string;
  adliye?: string;
  birim?: string;
  lokasyon?: string;
  status: string;
  separationDate?: string;
  separationReason?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePersonelDto {
  sicil: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  unvan?: string;
  adliye?: string;
  birim?: string;
  lokasyon?: string;
  status: string;
  separationDate?: string;
  separationReason?: string;
  tags: string[];
}

export interface UpdatePersonelDto {
  sicil?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  unvan?: string;
  adliye?: string;
  birim?: string;
  lokasyon?: string;
  status?: string;
  separationDate?: string;
  separationReason?: string;
  tags?: string[];
}

export interface PersonelFilterDto {
  search?: string;
  birim?: string;
  status?: string;
  adliye?: string;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  data: T;
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Personel CRUD operations
  async getPersoneller(filter?: PersonelFilterDto): Promise<Personel[]> {
    const params = new URLSearchParams();
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `/Personel${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<Personel[]>(endpoint);
  }

  async getPersonel(id: number): Promise<Personel> {
    return this.request<Personel>(`/Personel/${id}`);
  }

  async createPersonel(data: CreatePersonelDto): Promise<Personel> {
    return this.request<Personel>('/Personel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePersonel(id: number, data: UpdatePersonelDto): Promise<void> {
    return this.request<void>(`/Personel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePersonel(id: number): Promise<void> {
    return this.request<void>(`/Personel/${id}`, {
      method: 'DELETE',
    });
  }

  // Naklen personel
  async getNaklenPersoneller(filter?: PersonelFilterDto): Promise<Personel[]> {
    const params = new URLSearchParams();
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `/Personel/naklen${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<Personel[]>(endpoint);
  }

  // Utility endpoints
  async getBirimler(): Promise<string[]> {
    return this.request<string[]>('/Personel/birimler');
  }

  async getAdliyeler(): Promise<string[]> {
    return this.request<string[]>('/Personel/adliyeler');
  }

  async getStatusler(): Promise<string[]> {
    return this.request<string[]>('/Personel/statusler');
  }
}

export const apiService = new ApiService();
