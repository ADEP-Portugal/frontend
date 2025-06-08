import { DocumentType } from "./document-type";

export interface Associate {
  id?: string;

  email: string;

  fullName: string;

  phone: string;

  gender: string | undefined;

  birthday: string;

  document: string | undefined;

  documentType: DocumentType | undefined;

  documentExpirationDate: string | undefined;

  documentEmissionDate?: string | undefined;

  nationality: string | undefined;

  educationLevel: string | undefined;

  address: string | undefined;

  quotaStatus: string | undefined;

  nif: string | undefined;

  motherLanguage: string | undefined;

  employmentStatus: string | undefined;

  availabilityToWork: string[];

  areaInterest: string[];

  associateNumber: string | undefined;

  cardExpirationDate: string | undefined;

  profissionalExperience: string | undefined;
}
