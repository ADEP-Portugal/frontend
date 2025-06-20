
export interface Lawsuit {
  id?: string;

  client: string;

  birthday: string;

  phone: string;

  email: string;

  document?: string | undefined;

  documentEmissionDate?: string | undefined;

  documentExpirationDate?: string | undefined;

  orderDate: string;

  deadline: string;

  documentType?: string | undefined;

  status: string;

  orderType: string;

  description: string | undefined;

  responsible: string;

  paymentStatus: string;

  type: string;

  fileNames: string[];

  orderTypeDescription: string | undefined;
}
