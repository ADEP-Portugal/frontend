"use client"

import { BriefcaseBusinessIcon, EyeIcon, FileIcon, GraduationCapIcon, IdCardIcon, InfoIcon, Pen, Trash, UserIcon } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import NewLawsuit from "../components/new-lawsuit.dialog";

const Employee = () => {
    const employeeList = [
        {
            name: "Edson",
            gender: "Masculino",
            birthday: "26/12/2002",
            nactionality: "Brasileiro",
            address: "Rua das Flores, 123",
            phone: "912345678",
            email: "leonardosarto1@gmail.com",
            education: "Ensino Superior",
            motherLanguage: "Português",
        },
        {
            name: "Edson",
            gender: "Masculino",
            birthday: "26/12/2002",
            nactionality: "Brasileiro",
            address: "Rua das Flores, 123",
            phone: "912345678",
            email: "leonardosarto1@gmail.com",
            education: "Ensino Superior",
            motherLanguage: "Português",
        },
    ];

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="p-10 w-full">
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
                    <div className="gap-6">
                        {employeeList.map((employee, index) => (
                            <Card className="w-full mt-4" key={index}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <div className="flex flex-col gap-1">
                                            <div>
                                                {employee.name}
                                            </div>
                                            <div>
                                                {employee.email}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <span className="text-sm bg-primary text-white p-1.5 rounded">
                                                Paga
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
                                        <div><b>Nome:</b> {employee.name}</div>
                                        <div><b>Género:</b> {employee.gender}</div>
                                        <div><b>Data de Nascimento:</b> {employee.birthday}</div>
                                        <div><b>Nacionalidade:</b> {employee.nactionality}</div>
                                        <div className="flex gap-1 font-bold items-center">
                                            <IdCardIcon />
                                            Contacto
                                        </div>
                                        <div><b>Email:</b> {employee.email}</div>
                                        <div><b>Telemóvel:</b> {employee.phone}</div>
                                        <div><b>Morada:</b> {employee.address}</div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-1 font-bold items-center">
                                            <GraduationCapIcon />
                                            Formação
                                        </div>
                                        <div><b>Escolaridade:</b> {employee.education}</div>
                                        <div><b>Língua Materna:</b> {employee.motherLanguage}</div>
                                        <div className="flex gap-1 font-bold items-center">
                                            <BriefcaseBusinessIcon />
                                            Situação Profissional
                                        </div>
                                        <div><b>Situação de Emprego:</b> {employee.education}</div>
                                        <div><b>Disponibilidade:</b> {employee.education}</div>
                                        <div><b>Áreas de Interesse:</b> {employee.motherLanguage}</div>
                                        <div className="flex gap-1 font-bold items-center">
                                            <InfoIcon />
                                            Assosiação
                                        </div>
                                        <div><b>Número de Sócio:</b> {employee.education}</div>
                                        <div><b>Validade do Cartão:</b> {employee.education}</div>
                                        <div><b>Status da Cota:</b> {employee.motherLanguage}</div>
                                    </div>
                                    <div></div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div className="flex gap-4">
                                        <Button variant="outline"><Pen />Editar</Button>
                                        <Button variant="secondary"><EyeIcon />Ver detalhes</Button>
                                    </div>
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

export default Employee;
