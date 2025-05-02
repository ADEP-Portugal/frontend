export enum LawsuitOrderType {
  FOLLOW_UP = "Acompanhamento",
  AIMA_SCHEDULING = "Agendamento AIMA",
  RESIDENCE_CERTIFICATE = "Atestado de Residência",
  MISCELLANEOUS_LETTERS = "Cartas Diversas",
  DRIVER_LICENSE = "Certidão C. Condução",
  BIRTH_CERTIFICATE = "Certidão de Nascimento",
  CURRICULUM_VITAE = "Curriculum Vitae",
  IRS_STATEMENT = "Declaração IRS",
  DECLARATION_AUTHORIZATION = "Declaração/Autorização",
  RESIDENCE_INSTRUCTION = "Instrução proc. residência",
  EXPRESSION_INTEREST = "Manifestação de interesse",
  PROCURATION = "Procuração",
  SIGNATURE_RECOGNITION = "Reconhecimento de Assinatura",
  CRIMINAL_RECORD = "Registro Criminal",
  RENEWAL_RESIDENCE_CERTIFICATE = "Renovação de Aut de residência",
  ID_RENEWAL = "Renovação de BI",
  CPLP_RESIDENCE = "Residência CPLP",
  NIF_REQUEST = "Solicitação de NIF",
  NISS_REQUEST = "Solicitação de NISS",
  DRIVING_LICENSE_EXCHANGE = "Troca de carta de condução",
  OTHER = "Outros pedidos",
}

export function getLawsuitOrderTypeByValue(value: string): LawsuitOrderType | undefined {
  if (!value) return undefined;
  if (Object.values(LawsuitOrderType).includes(value as LawsuitOrderType)) {
    return value as LawsuitOrderType;
  }
}

export function getLawsuitOrderTypeEnum(value: string): LawsuitOrderType | undefined {
  return (Object.entries(LawsuitOrderType).find(
    ([_, v]) => v === value
  )?.[0] as keyof typeof LawsuitOrderType) as LawsuitOrderType | undefined;
}
