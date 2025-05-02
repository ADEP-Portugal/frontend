"use client"

import { BriefcaseBusinessIcon, EyeIcon, GraduationCapIcon, IdCardIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Associate } from "../types/associate";
import { getLabelGender, Gender } from "../types/gender";
import { formatDateToPtBr } from "../util/date.util";
import { Nationality } from "../types/nationality";
import { EducationLevel } from "../types/education-level";
import { JobStatus } from "../types/job-status";
import { DocumentType } from "../types/document-type";
import { AreaInterest } from "../types/area-interest";
import EditAssociate from "./edit-associate.dialog";

const AssociateDetails = ({ associate }: { associate: Associate }) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="secondary">
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
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">
                            Fechar
                        </Button>
                    </DialogClose>
                    <EditAssociate associate={associate} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AssociateDetails;
