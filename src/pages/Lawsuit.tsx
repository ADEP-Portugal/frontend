"use client"

import { BriefcaseBusinessIcon, FileIcon, Pen, Trash, UserIcon } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { LawsuitStatus } from "../types/lawsuit-status";
import { LawsuitOrderType } from "../types/lawsuit-order-type";
import { DocumentType } from "../types/document-type";
import NewLawsuit from "../components/new-lawsuit.dialog";

const Lawsuit = () => {
    const eventList = [
        {
            responsible: "Edson",
            status: LawsuitStatus.ARCHIVED,
            type: LawsuitOrderType.FOLLOW_UP,
            name: "Leonardo Sarto",
            birthday: "26/12/2002",
            phone: "912345678",
            email: "leonardosarto1@gmail.com",
            documentType: DocumentType.ID_CARD,
            document: "12321412",
            emissionDate: "17/04/2023",
            expirationDate: "17/04/2025",
            orderDate: "17/04/2023",
            deadline: "17/04/2025",
            observation: "Levar documentos",
        },

    ];

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="p-10">
                    <div className="flex justify-between">
                        <NewLawsuit />
                        <div className="flex gap-6 w-8/12">
                            <Input placeholder="Buscar processos..." />
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
                    <div className="grid grid-cols-4 gap-6">
                        {eventList.map((lawsuit, index) => (
                            <Card className="w-[280px] mt-4" key={index}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>Processo</span>
                                        <span className="text-sm text-gray-500">{lawsuit.expirationDate}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <p className="flex gap-1"><UserIcon />{lawsuit.name}</p>
                                    <p className="flex gap-1"><FileIcon />{lawsuit.document}</p>
                                    <p className="flex gap-1"><FileIcon />{lawsuit.status}</p>
                                    <p className="flex gap-1"><BriefcaseBusinessIcon />{lawsuit.responsible}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline"><Pen />Editar</Button>
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
                                                <AlertDialogAction>Continuar</AlertDialogAction>
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

export default Lawsuit;
