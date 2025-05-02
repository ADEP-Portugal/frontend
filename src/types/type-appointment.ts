export enum TypeAppointment {
  PRESENCIAL = "PRESENCIAL",
  TELEPHONE = "TELEPHONE",
}

export function getAppointmentTypeLabel(type: TypeAppointment): string {
  switch (type) {
    case TypeAppointment.PRESENCIAL:
      return "Presencial";
    case TypeAppointment.TELEPHONE:
      return "Telefônico";
    default:
      return "Desconhecido";
  }
}