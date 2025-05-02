"use client"

import { BriefcaseBusinessIcon, FileIcon, Loader2Icon, MapPin, PhoneIcon, StickyNoteIcon, Trash, UserIcon } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { TypeAppointment } from "../types/type-appointment";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { AppointmentService } from "../services/appointment.service";
import { getPeriodEventRequestToPtBr, PeriodFilter } from "../types/period-filter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import NewAppointment from "../components/new-appointment.dialog";
import { formatDateToPtBr } from "../util/date.util";
import EditAppointment from "../components/edit-appointment.dialog";

const Appointment = () => {
    const queryClient = useQueryClient();
    const appointmentService = new AppointmentService();
    const [period, setPeriod] = useState<PeriodFilter>(PeriodFilter.ALL);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['appointments', debouncedSearch, period],
        queryFn: () => appointmentService.filter(search, period),
    });
    const mutation = useMutation({
        mutationFn: (id: string | number) => appointmentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success("Agendamento excluído com sucesso!");
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
                            <NewAppointment />
                            <div className="flex gap-6 w-8/12">
                                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar atendimentos..." />
                                <Select value={period} onValueChange={(value) => setPeriod(value as PeriodFilter)}>
                                    <SelectTrigger className="w-[255px]">
                                        <SelectValue placeholder="Selecione o período" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(PeriodFilter).map(([key, value]) => (
                                            <SelectItem key={key} value={value}>
                                                {getPeriodEventRequestToPtBr(value)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-4 gap-6">
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
                            {data != null && data.data != null && data.data.length === 0 && (
                                <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                    <StickyNoteIcon size={40} className="text-gray-500" />
                                    <span className="text-gray-500">Nenhum agendamento encontrado</span>
                                </div>
                            )}
                            {data != null && data.data.length > 0 && data.data.map((appointment, index) => (
                                <Card className="w-full mt-4" key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Atendimento</span>
                                            <span className="text-sm text-gray-500">{formatDateToPtBr(new Date(appointment.date))}, {appointment.time}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2">
                                        <p className="flex gap-1"><UserIcon />{appointment.client}</p>
                                        <p className="flex gap-1">
                                            <FileIcon />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="line-clamp-1">
                                                            {appointment.reason}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{appointment.reason}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </p>
                                        <p className="flex gap-1">
                                            {appointment.type === TypeAppointment.PRESENCIAL ? <MapPin /> : <PhoneIcon />}
                                            {appointment.type === TypeAppointment.PRESENCIAL ? "Presencial" : "Telefónico"}
                                        </p>
                                        <p className="flex gap-1"><BriefcaseBusinessIcon />{appointment.responsible}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <EditAppointment appointment={appointment} />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="hover:bg-red-700" variant="destructive"><Trash />Excluir</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esse atendimento será excluído permanentemente e não poderá ser desfeito.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => mutation.mutate(appointment.id!)}>Continuar</AlertDialogAction>
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

export default Appointment;
