export interface SkinType {
  skinTypeId: number;
  skinTypeName: string;
  priority: number;
}

export interface Customer {
  customerId: number;
  accountId: number;
  email: string;
  fullName: string;
  birthday: string;
  phoneNumber: string;
  confirmedEmail: boolean;
  status: boolean;
  skinType?: SkinType | null; // Có thể không có skinType
}

export interface ApiResponse {
  $values: Customer[];
}
