"use client"

import { BriefcaseBusinessIcon, CalendarIcon, DollarSignIcon, FileIcon, Loader2Icon, Pen, PhoneIcon, StickyNoteIcon, Trash, UserIcon } from "lucide-react";
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

const Lawsuit = () => {
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

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="w-full">
                    <CardContent>
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
                                <Card className="w-[280px] mt-4" key={index}>
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

export default Lawsuit;
