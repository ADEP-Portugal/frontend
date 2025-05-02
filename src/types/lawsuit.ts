
export interface Lawsuit {
  id?: string;

  client: string;

  birthday: string;

  phone: string;

  email: string;

  document?: string;

  documentEmissionDate?: string;

  documentExpirationDate?: string;

  orderDate: string;

  deadline: string;

  documentType?: string;

  status: string;

  orderType: string;

  description: string;

  responsible: string;

  paymentStatus: string;

  type: string;

  fileNames: string[];
}
