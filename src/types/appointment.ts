import { Gender } from "./gender";
import { TypeAppointment } from "./type-appointment";

export interface Appointment {
  id?: string;

  client: string;

  reason: string;

  responsible: string;

  type: TypeAppointment;

  date: string;

  time: string;

  description: string;

  gender: Gender;

  associate: boolean;
}
