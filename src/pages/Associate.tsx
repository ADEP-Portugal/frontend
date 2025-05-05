"use client"

import { BriefcaseBusinessIcon, DownloadIcon, GraduationCapIcon, IdCardIcon, InfoIcon, Loader2Icon, StickyNoteIcon, Trash, UserIcon } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import NewAssociate from "../components/new-associate.dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssociateService } from "../services/associate.service";
import { useEffect, useState } from "react";
import AssociateDetails from "../components/associate-details.dialog";
import { formatDateToPtBr } from "../util/date.util";
import { EducationLevel } from "../types/education-level";
import { Nationality } from "../types/nationality";
import { Gender, getLabelGender } from "../types/gender";
import { JobStatus } from "../types/job-status";
import jsPDF from "jspdf";
import { Associate } from "../types/associate";
import EditAssociate from "../components/edit-associate.dialog";
import { toast } from "sonner";
import { AreaInterest } from "../types/area-interest";

const AssociatePage = () => {
    const queryClient = useQueryClient();
    const associateService = new AssociateService();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { isLoading, isError, data: associateList, error } = useQuery({
        queryKey: ['associates', debouncedSearch],
        queryFn: () => associateService.filter(search),
    });
    const mutation = useMutation({
        mutationFn: (id: string | number) => associateService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['associates'] });
            toast.success("Associado excluído com sucesso!");
        }
    });

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const generatePdf = async (associate: Associate) => {
        const doc = new jsPDF();

        //Background color
        doc.setFillColor(239, 244, 247);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        //Header
        doc.setFontSize(20);
        doc.setTextColor(39, 104, 128);
        doc.setFont("helvetica", "bold");
        doc.addImage("/logo.png", "PNG", 10, 17, 35, 25);
        doc.text("Ficha de Associado ADIP", 65, 25);
        doc.text("ADIP", 95, 35);
        doc.setDrawColor(96, 165, 193);
        doc.setLineWidth(0.5);
        doc.line(10, 50, 200, 50);

        //Personal Information
        doc.setFontSize(14);
        doc.text("Informações Pessoais", 10, 65);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Nome Completo:", 10, 75);
        doc.text("Email:", 10, 83);
        doc.text("Telemóvel:", 10, 91);
        doc.text("Data de Nascimento:", 10, 99);
        doc.text("Género:", 10, 107);
        doc.text("Nacionalidade:", 10, 115);
        doc.text("Morada:", 10, 123);
        doc.text("NIF:", 10, 131);

        //Profissional Information
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Informações Profissionais", 10, 145);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Escolaridade:", 10, 155);
        doc.text("Situação de Emprego:", 10, 163);
        doc.text("Disponibilidade:", 10, 171);
        doc.text("Áreas de Interesse:", 10, 179);

        //Identification Document
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Documentos de Identificação", 10, 193);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Tipo de Documento:", 10, 203);
        doc.text("Número do Documento:", 10, 211);
        doc.text("Data de Validade:", 10, 219);

        //Associate Details
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Detalhes de Associado", 10, 233);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Número de Sócio:", 10, 243);
        doc.text("Validade do Cartão:", 10, 251);
        doc.text("Status da Cota:", 10, 259);

        //Personal Information Values
        doc.setTextColor(0, 0, 0);
        doc.text(associate.fullName, 80, 75);
        doc.text(associate.email, 80, 83);
        doc.text(associate.phone, 80, 91);
        doc.text(formatDateToPtBr(new Date(associate.birthday)), 80, 99);
        doc.text(getLabelGender(associate.gender as Gender), 80, 107);
        doc.text(associate.nationality, 80, 115);
        doc.text(associate.address, 80, 123);
        doc.text(associate.nif ?? "Não informado", 80, 131);

        //Profissional Information Values
        doc.text(EducationLevel[associate.educationLevel as keyof typeof EducationLevel], 80, 155);
        doc.text(associate.employmentStatus ?? "Não informado", 80, 163);
        doc.text(associate.availabilityToWork.length == 0 ? "Não informado" : associate.availabilityToWork.map((item) => item == "MORNING" ? "Manhã" : item == "AFTERNOON" ? "Tarde" : "Noite").join(', '), 80, 171);
        doc.text(associate.areaInterest.length == 0 ? "Não informado" : associate.areaInterest.join(", "), 80, 179);

        //Identification Document Values
        doc.text(associate.documentType ?? "Não informado", 80, 203);
        doc.text(associate.document ?? "Não informado", 80, 211);
        doc.text(formatDateToPtBr(new Date(associate.documentExpirationDate!)) ?? "Não informado", 80, 219);

        //Associate Details Values
        doc.text(associate.associateNumber ?? "Não informado", 80, 243);
        doc.text(formatDateToPtBr(new Date(associate.cardExpirationDate!)) ?? "Não informado", 80, 251);
        doc.text(associate.quotaStatus == "PAID" ? "Paga" : "Pendente", 80, 259);
        
        //Footer
        doc.setDrawColor(96, 165, 193);
        doc.setLineWidth(0.5);
        doc.line(10, 270, 200, 270);
        doc.setFontSize(10);
        doc.setTextColor(121, 122, 122);
        doc.text("Assinatura do Associado", 85, 277);
        doc.text("Associação Despertar Imigrantes em Portugal", 69, 285);
        doc.text(`Documento Confidencial - Gerado em ${formatDateToPtBr(new Date())}`, 65, 290);

        doc.save(`Ficha_Associado_${associate.fullName}.pdf`);
    }

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="p-10 w-full">
                    <div className="flex justify-between">
                        <NewAssociate />
                        <div className="flex gap-6 w-8/12">
                            <Input onChange={(e) => setSearch(e.target.value)} placeholder="Buscar associados..." />
                        </div>
                    </div>
                    <div className="gap-6">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center col-span-4">
                                <Loader2Icon className="animate-spin" />
                            </div>)
                        }
                        {isError && (
                            <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                <StickyNoteIcon size={40} className="text-red-500" />
                                <span className="text-red-500">Erro ao carregar eventos</span>
                                <span className="text-red-500">{error.message}</span>
                            </div>
                        )}
                        {associateList != null && associateList.data != null && associateList.data.length === 0 && (
                            <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                <StickyNoteIcon size={40} className="text-gray-500" />
                                <span className="text-gray-500">Nenhum agendamento encontrado</span>
                            </div>
                        )}
                        {associateList != null && associateList.data.map((associate, index) => (
                            <Card className="w-full mt-4" key={index}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <div className="flex flex-col gap-1">
                                            <div>
                                                {associate.fullName}
                                            </div>
                                            <div>
                                                {associate.email}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <span className="text-sm bg-primary text-white p-1.5 rounded">
                                                {associate.quotaStatus == "PAID" ? "Paga" : "Pendente"}
                                            </span>
                                            <span className="text-sm text-white flex p-1.5 gap-1 bg-secondary rounded items-center">
                                                <IdCardIcon /> Sem Nº Sócio
                                            </span>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-between">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-1 font-bold items-center">
                                            <UserIcon />
                                            Dados Pessoais
                                        </div>
                                        <div><b>Nome:</b> {associate.fullName}</div>
                                        <div><b>Género:</b> {getLabelGender(associate.gender as Gender)}</div>
                                        <div><b>Data de Nascimento:</b> {formatDateToPtBr(new Date(associate.birthday))}</div>
                                        <div><b>Nacionalidade:</b> {Nationality[associate.nationality as keyof typeof Nationality]}</div>
                                        <div className="flex gap-1 font-bold items-center">
                                            <IdCardIcon />
                                            Contacto
                                        </div>
                                        <div><b>Email:</b> {associate.email}</div>
                                        <div><b>Telemóvel:</b> {associate.phone}</div>
                                        <div><b>Morada:</b> {associate.address}</div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-1 font-bold items-center">
                                            <GraduationCapIcon />
                                            Formação
                                        </div>
                                        <div><b>Escolaridade:</b> {EducationLevel[associate.educationLevel as keyof typeof EducationLevel]}</div>
                                        {associate.motherLanguage != null && <div><b>Língua Materna:</b> {associate.motherLanguage}</div>}
                                        {(associate.employmentStatus != null || associate.availabilityToWork.length > 0 || associate.areaInterest.length > 0) && <div className="flex gap-1 font-bold items-center">
                                            <BriefcaseBusinessIcon />
                                            Situação Profissional
                                        </div>}
                                        {associate.employmentStatus != null && <div><b>Situação de Emprego:</b> {JobStatus[associate.employmentStatus as keyof typeof JobStatus]}</div>}
                                        {associate.availabilityToWork.length > 0 && <div><b>Disponibilidade:</b> {associate.availabilityToWork.map((item) => item == "MORNING" ? "Manhã" : item == "AFTERNOON" ? "Tarde" : "Noite").join(", ")}</div>}
                                        {associate.areaInterest.length > 0 && <div><b>Áreas de Interesse:</b> {associate.areaInterest.map((item) => AreaInterest[item as keyof typeof AreaInterest]).join(", ")}</div>}
                                        {associate.associateNumber != null && associate.cardExpirationDate != null && <div className="flex gap-1 font-bold items-center">
                                            <InfoIcon />
                                            Associação
                                        </div>}
                                        {associate.associateNumber != null && <div><b>Número de Sócio:</b> {associate.associateNumber}</div>}
                                        {associate.cardExpirationDate != null && <div><b>Validade do Cartão:</b> {formatDateToPtBr(new Date(associate.cardExpirationDate))}</div>}
                                    </div>
                                    <div></div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div className="flex gap-4">
                                        <EditAssociate associate={associate} />
                                        <AssociateDetails associate={associate} />
                                        <Button onClick={() => generatePdf(associate)} variant="outline"><DownloadIcon />Baixar Ficha</Button>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className="hover:bg-red-700" variant="destructive"><Trash />Excluir</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esse associado será excluído permanentemente e não poderá ser desfeito.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => mutation.mutate(associate.id!)}>Continuar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AssociatePage;
