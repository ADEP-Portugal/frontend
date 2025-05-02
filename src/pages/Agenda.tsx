"use client"

import { FileIcon, Loader2, MapPin, StickyNote, Trash } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventService } from "../services/event.service";
import NewEvent from "../components/new-event.dialog";
import { toast } from "sonner";
import EditEvent from "../components/edit-event.dialog";
import { formatDateToPtBr } from "../util/date.util";
import { useEffect, useState } from "react";
import { getPeriodEventRequestToPtBr, PeriodFilter } from "../types/period-filter";

const Agenda = () => {
    const queryClient = useQueryClient();
    const eventService = new EventService();
    const [period, setPeriod] = useState<PeriodFilter>(PeriodFilter.ALL);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['events', debouncedSearch, period],
        queryFn: () => eventService.filter(search, period),
    });
    const mutation = useMutation({
        mutationFn: (id: string | number) => eventService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success("Evento excluído com sucesso!");
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
                            <NewEvent />
                            <div className="flex gap-6 w-8/12">
                                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar eventos..." />
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
                                    <Loader2 className="animate-spin" />
                                </div>)
                            }
                            {isError && (
                                <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                    <StickyNote size={40} className="text-red-500" />
                                    <span className="text-red-500">Erro ao carregar eventos</span>
                                    <span className="text-red-500">{error.message}</span>
                                </div>
                            )}
                            {data != null && data.data != null && data.data.length === 0 && (
                                <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                    <StickyNote size={40} className="text-gray-500" />
                                    <span className="text-gray-500">Nenhum evento encontrado</span>
                                </div>
                            )}
                            {data != null && data.data.length > 0 && data.data.map((event, index) => (
                                <Card className="w-[280px]" key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            {event.name.substring(0, 12)}
                                            <span className="text-sm text-gray-500 p-1 rounded-md">{formatDateToPtBr(new Date(event.date))}, {event.time}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2">
                                        <p className="flex gap-1">
                                            <MapPin />
                                            <span className="line-clamp-1">
                                                {event.location.substring(0, 26)}
                                            </span>
                                        </p>
                                        <p className="flex gap-1">
                                            <FileIcon />
                                            <span className="line-clamp-1">
                                                {event.description.substring(0, 26)}
                                            </span>
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <EditEvent event={event} />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="hover:bg-red-700" variant="destructive"><Trash />Excluir</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esse evento será excluído permanentemente e não poderá ser desfeito.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => mutation.mutate(event.id!)}>Continuar</AlertDialogAction>
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

export default Agenda;
