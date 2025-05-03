import { DocumentType } from "./document-type";

export interface Associate {
  id?: string;

  email: string;

  fullName: string;

  phone: string;

  gender: string;

  birthday: string;

  document: string | undefined;

  documentType: DocumentType | undefined;

  documentExpirationDate: string | undefined;

  documentEmissionDate?: string | undefined;

  nationality: string;

  educationLevel: string;

  address: string;

  quotaStatus: string;

  nif: string | undefined;

  motherLanguage: string | undefined;

  employmentStatus: string | undefined;

  availabilityToWork: string[];

  areaInterest: string[];

  associateNumber: string | undefined;

  cardExpirationDate: string | undefined;

  profissionalExperience: string | undefined;
}
