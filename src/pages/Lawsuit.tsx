"use client"

import { BriefcaseBusinessIcon, CalendarIcon, DollarSignIcon, DownloadIcon, FileIcon, Loader2Icon, PhoneIcon, StickyNoteIcon, Trash, UserIcon } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import NewLawsuit from "../components/new-lawsuit.dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LawsuitService } from "../services/lawsuit.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDateToPtBr } from "../util/date.util";
import { LawsuitOrderType } from "../types/lawsuit-order-type";
import { LawsuitStatus } from "../types/lawsuit-status";
import { PaymentStatus } from "../types/payment-status";
import EditLawsuit from "../components/edit-lawsuit.dialog";
import jsPDF from "jspdf";
import { Lawsuit } from "../types/lawsuit";
import { DocumentType } from "../types/document-type";

const LawsuitPage = () => {
    const queryClient = useQueryClient();
    const lawsuitService = new LawsuitService();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['lawsuits', debouncedSearch],
        queryFn: () => lawsuitService.filter(search),
    });
    const mutation = useMutation({
        mutationFn: (id: string | number) => lawsuitService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lawsuits'] });
            toast.success("Processo excluído com sucesso!");
        }
    });

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const generatePdf = async (lawsuit: Lawsuit) => {
        const doc = new jsPDF();

        //Background color
        doc.setFillColor(255, 255, 255);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        //Header
        doc.setFontSize(20);
        doc.setTextColor(39, 104, 128);
        doc.setFont("helvetica", "bold");
        doc.addImage("/logo.png", "PNG", 10, 17, 35, 25);
        doc.text(LawsuitOrderType[lawsuit.orderType as keyof typeof LawsuitOrderType], 65, 25);
        doc.text("Documento para Assinatura", 55, 35);
        doc.setDrawColor(96, 165, 193);
        doc.setLineWidth(0.5);
        doc.line(10, 50, 200, 50);

        //Lawsuit Information
        doc.setFontSize(14);
        doc.text("Informações do Processo", 10, 60);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Responsável:", 10, 67);
        doc.text("Estado do Processo:", 10, 75);
        doc.text("Tipo de Pedido:", 10, 83);

        //Client Information
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Dados do Interessado", 10, 93);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Nome:", 10, 100);
        doc.text("Data de Nascimento:", 10, 108);
        doc.text("Telmóvel:", 10, 116);
        doc.text("Email:", 10, 124);

        //Document Details
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Detalhes do Documento", 10, 134);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Tipo de Documento:", 10, 141);
        doc.text("Número do Documento:", 10, 149);
        doc.text("Data de Emissão:", 10, 157);
        doc.text("Data de Validade:", 10, 165);

        //Lawsuit Details
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Informações Administrativas", 10, 175);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Data de Entrada:", 10, 183);
        doc.text("Data de Entrega:", 10, 191);
        doc.text("Status de Pagamento:", 10, 199);

        //Observations
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Observações", 10, 209);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        //Personal Information Values
        doc.setTextColor(0, 0, 0);
        doc.text(lawsuit.responsible, 80, 67);
        doc.text(LawsuitStatus[lawsuit.status as keyof typeof LawsuitStatus], 80, 75);
        doc.text(LawsuitOrderType[lawsuit.orderType as keyof typeof LawsuitOrderType], 80, 83);

        //Client Information Values
        doc.text(lawsuit.client, 80, 100);
        doc.text(formatDateToPtBr(new Date(lawsuit.birthday)), 80, 108);
        doc.text(lawsuit.phone ?? "Não informado", 80, 116);
        doc.text(lawsuit.email ?? "Não informado", 80, 124);

        //Document Details Values
        doc.text(DocumentType[lawsuit.documentType as keyof typeof DocumentType] ?? "Não informado", 80, 141);
        doc.text(lawsuit.document ?? "Não informado", 80, 149);
        doc.text(lawsuit.documentEmissionDate ? formatDateToPtBr(new Date(lawsuit.documentEmissionDate)) : "Não informado", 80, 157);
        doc.text(lawsuit.documentExpirationDate ? formatDateToPtBr(new Date(lawsuit.documentExpirationDate)) : "Não informado", 80, 165);

        //Lawsuit Details Values
        doc.text(lawsuit.orderDate ? formatDateToPtBr(new Date(lawsuit.orderDate)) : "Não informado", 80, 183);
        doc.text(lawsuit.deadline ? formatDateToPtBr(new Date(lawsuit.deadline)) : "Não informado", 80, 191);
        doc.text(PaymentStatus[lawsuit.paymentStatus as keyof typeof PaymentStatus], 80, 199);

        //Observations
        doc.text(lawsuit.description ?? "Sem observações", 10, 216);

        //Footer
        doc.setDrawColor(96, 165, 193);
        doc.setLineWidth(0.5);
        doc.line(10, 240, 200, 240);
        doc.line(10, 270, 200, 270);
        doc.setFontSize(10);
        doc.setTextColor(121, 122, 122);
        doc.text("Assinatura do Responsável", 85, 247);
        doc.text("Assinatura do Interessado", 85, 277);
        doc.text(`Gerado em ${formatDateToPtBr(new Date())}`, 85, 290);

        doc.save(`Ficha_Processo_${lawsuit.client}.pdf`);
    }

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="w-full">
                    <CardContent>
                        <div className="flex justify-between">
                            <NewLawsuit generatePdf={generatePdf} />
                            <div className="flex gap-6 w-8/12">
                                <Input onChange={(e) => setSearch(e.target.value)} placeholder="Buscar processos..." />
                                <Select>
                                    <SelectTrigger className="w-[255px]">
                                        <SelectValue placeholder="Selecione o período" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os Processos</SelectItem>
                                        <SelectItem value="today">Hoje</SelectItem>
                                        <SelectItem value="week">Esta Semana</SelectItem>
                                        <SelectItem value="month">Este Mês</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center col-span-4">
                                    <Loader2Icon className="animate-spin" />
                                </div>)
                            }
                            {isError && (
                                <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                    <StickyNoteIcon size={40} className="text-red-500" />
                                    <span className="text-red-500">Erro ao carregar processos</span>
                                    <span className="text-red-500">{error.message}</span>
                                </div>
                            )}
                            {data != null && data.data != null && data.data.length === 0 && (
                                <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                    <StickyNoteIcon size={40} className="text-gray-500" />
                                    <span className="text-gray-500">Nenhum processo encontrado</span>
                                </div>
                            )}
                            {data != null && data.data.length > 0 && data.data.map((lawsuit, index) => (
                                <Card className="w-[400px] mt-4" key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Processo</span>
                                            <span className="text-sm text-gray-500">{formatDateToPtBr(new Date(lawsuit.orderDate))}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2">
                                        <p className="flex gap-1"><UserIcon />{lawsuit.client}</p>
                                        <p className="flex gap-1"><FileIcon />{LawsuitOrderType[lawsuit.orderType as keyof typeof LawsuitOrderType]}</p>
                                        <p className="flex gap-1"><FileIcon />{LawsuitStatus[lawsuit.status as keyof typeof LawsuitStatus]}</p>
                                        <p className="flex gap-1"><PhoneIcon />{lawsuit.phone}</p>
                                        <p className="flex gap-1"><CalendarIcon />{formatDateToPtBr(new Date(lawsuit.orderDate))}</p>
                                        <p className="flex gap-1"><DollarSignIcon />{PaymentStatus[lawsuit.paymentStatus as keyof typeof PaymentStatus]}</p>
                                        <p className="flex gap-1"><BriefcaseBusinessIcon />{lawsuit.responsible}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <EditLawsuit lawsuit={lawsuit} />
                                        <Button onClick={() => generatePdf(lawsuit)} variant="outline"><DownloadIcon />Baixar Ficha</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="hover:bg-red-700" variant="destructive"><Trash />Excluir</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esse processo será excluído permanentemente e não poderá ser desfeito.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => mutation.mutate(lawsuit.id!)}>Continuar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LawsuitPage;
