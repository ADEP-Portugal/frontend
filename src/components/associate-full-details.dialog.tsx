"use client"

import { BriefcaseBusinessIcon, EyeIcon, FileIcon, GraduationCapIcon, IdCardIcon, PhoneIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Associate } from "../types/associate";
import { getLabelGender, Gender } from "../types/gender";
import { formatDateToPtBr } from "../util/date.util";
import { Nationality } from "../types/nationality";
import { EducationLevel } from "../types/education-level";
import { JobStatus } from "../types/job-status";
import { DocumentType } from "../types/document-type";
import { AreaInterest } from "../types/area-interest";
import { AppointmentService } from "../services/appointment.service";
import { useQuery } from "@tanstack/react-query";
import { getAppointmentTypeLabel } from "../types/type-appointment";
import { LawsuitService } from "../services/lawsuit.service";
import { LawsuitStatus } from "../types/lawsuit-status";

const AssociateFullDetails = ({ associate }: { associate: Associate }) => {
    const appointmentService = new AppointmentService();
    const lawsuitService = new LawsuitService();
    const { data: appointmentList } = useQuery({
        queryKey: ['appointment-associate', associate.fullName],
        queryFn: () => appointmentService.filter(associate.fullName),
    });
    const { data: lawsuitList } = useQuery({
        queryKey: ['lawsuit-associate', associate.fullName],
        queryFn: () => lawsuitService.filter(associate.fullName),
    });

    return (
        <Dialog>
            <DialogTrigger>
                <Button>
                    <EyeIcon />
                    Ver Detalhes
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Detalhes do Associado</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-4">
                        <Card className="shadow-lg gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <UserIcon className="mr-2" />
                                    Dados Pessoais
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div><b>Nome:</b> {associate.fullName}</div>
                                <div><b>Género:</b> {getLabelGender(associate.gender as Gender)}</div>
                                <div><b>Data de Nascimento:</b> {formatDateToPtBr(new Date(associate.birthday))}</div>
                                <div><b>Nacionalidade:</b> {Nationality[associate.nationality as keyof typeof Nationality]}</div>
                                {associate.nif && (
                                    <div><b>NIF:</b> {associate.nif}</div>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <IdCardIcon className="mr-2" />
                                    Contacto
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div><b>Email:</b> {associate.email}</div>
                                <div><b>Telemóvel:</b> {associate.phone}</div>
                                <div><b>Morada:</b> {associate.address}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <PhoneIcon className="mr-2" />
                                    Atendimentos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {appointmentList != null && appointmentList.data.length == 0 ? (
                                    <div>Não há atendimentos agendados</div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {appointmentList != null && appointmentList.data.map((appointment) => (
                                            <div key={appointment.id} className="flex flex-col border-b-2 border-gray-300 pb-2">
                                                <div><b>Data:</b> {formatDateToPtBr(new Date(appointment.date))}</div>
                                                <div><b>Hora:</b> {appointment.time}</div>
                                                <div><b>Tipo de Atendimento:</b> {getAppointmentTypeLabel(appointment.type)}</div>
                                                <div><b>Responsável:</b> {appointment.responsible}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Card className="shadow-lg gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <GraduationCapIcon className="mr-2" />
                                    Formação e Profissão
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div><b>Escolaridade:</b> {EducationLevel[associate.educationLevel as keyof typeof EducationLevel]}</div>
                                <div><b>Língua Materna:</b> {associate.motherLanguage}</div>
                                <div><b>Experiência Profissional:</b> {associate.profissionalExperience != null ? associate.profissionalExperience.substring(0, 38) + "..." : "Não informado"}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BriefcaseBusinessIcon className="mr-2" />
                                    Situação Profissional
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div><b>Situação de Emprego:</b> {JobStatus[associate.employmentStatus as keyof typeof JobStatus] ?? "Não informado"}</div>
                                <div><b>Disponibilidade:</b> {associate.availabilityToWork.length == 0 ? "Não informado" : associate.availabilityToWork.map((item) => item == "MORNING" ? "Manhã" : item == "AFTERNOON" ? "Tarde" : "Noite").join(", ")}</div>
                                <div><b>Áreas de Interesse:</b> {associate.areaInterest.length == 0 ? "Não informado" : associate.areaInterest.map((item) => AreaInterest[item as keyof typeof AreaInterest]).join(", ")}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileIcon className="mr-2" />
                                    Processos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {lawsuitList != null && lawsuitList.data.length == 0 ? (
                                    <div>Não há processos registrados</div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {lawsuitList != null && lawsuitList.data.map((lawsuit) => (
                                            <div key={lawsuit.id} className="flex flex-col border-b-2 border-gray-300 pb-2">
                                                <div><b>Data:</b> {formatDateToPtBr(new Date(lawsuit.orderDate))}</div>
                                                <div><b>Status:</b> {LawsuitStatus[lawsuit.status as keyof typeof LawsuitStatus]}</div>
                                                <div><b>Responsável:</b> {lawsuit.responsible}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Card className="shadow-lg gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <IdCardIcon className="mr-2" />
                                    Detalhes do Associado
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div><b>Número de Sócio:</b> {associate.associateNumber ?? "Não informado"}</div>
                                <div><b>Validade do Cartão:</b> {formatDateToPtBr(new Date(associate.cardExpirationDate))}</div>
                                <div><b>Status da Cota:</b> {associate.quotaStatus == "PAID" ? "Paga" : "Pendente"}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <IdCardIcon className="mr-2" />
                                    Documento de Identifacação
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div><b>Tipo de Documento:</b> {DocumentType[associate.documentType as keyof typeof DocumentType] ?? "Não informado"}</div>
                                <div><b>Número do Documento:</b> {associate.document ?? "Não informado"}</div>
                                <div><b>Data de Validade:</b> {formatDateToPtBr(new Date(associate.documentExpirationDate))}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssociateFullDetails;
