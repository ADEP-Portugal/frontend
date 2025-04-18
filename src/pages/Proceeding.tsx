"use client"

import { BriefcaseBusinessIcon, CalendarIcon, CirclePlus, Clock, ClockIcon, FileIcon, MapPin, Pen, PhoneIcon, StickyNote, Trash, UserIcon } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { cn } from "../lib/utils";
import React from "react";
import { format } from "date-fns";
import { Box } from "../components/ui/box";
import { Textarea } from "../components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { TypeAppointment } from "../types/type-appointment";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

const FormSchema = z.object({
    name: z.string({ required_error: "Campo obrigatório" }),
    reason: z.string({ required_error: "Campo obrigatório", }),
    date: z.string({ required_error: "Campo obrigatório", }),
    time: z.string({ required_error: "Campo obrigatório", }),
    typeAppointment: z.string({ required_error: "Campo obrigatório", }),
    responsible: z.string({ required_error: "Campo obrigatório", }),
    observation: z.string({ required_error: "Campo obrigatório", }),
})

const Proceeding = () => {
    const [date, setDate] = React.useState<Date>()
    const eventList = [
        {
            name: "Leonardo Sarto",
            date: "17/04/2025",
            time: "10:00",
            reason: "Não estou conseguindo me legalizar",
            typeAppointment: TypeAppointment.PRESENCIAL,
            responsible: "Edson",
            observation: "Levar documentos",
        },
        {
            name: "Leonardo Sarto",
            date: "17/04/2025",
            time: "10:00",
            reason: "Não estou conseguindo me legalizar",
            typeAppointment: TypeAppointment.TELEFONICO,
            responsible: "Edson",
            observation: "Levar documentos",
        },
    ];
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="p-10">
                    <div className="flex justify-between">
                        <Dialog>
                            <DialogTrigger>
                                <Button>
                                    <CirclePlus />
                                    Adicionar Atendimento
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Adicionar Novo Atendimento</DialogTitle>
                                </DialogHeader>
                                <Form {...form}>
                                    <form className="flex flex-col gap-4 py-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        <span>Nome do Cliente</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="reason"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        <span>Motivo</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex gap-10">
                                            <FormField
                                                control={form.control}
                                                name="date"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            <span>Data</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-[210px] justify-start text-left font-normal",
                                                                            !date && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                                                                        <CalendarIcon className="ml-auto h-4 w-4" />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={date}
                                                                        onSelect={setDate}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="time"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>
                                                            <span>Hora</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Box className="relative">
                                                                <ClockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0 h-4 w-4" />
                                                                <Input
                                                                    {...field}
                                                                />
                                                            </Box>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex gap-10">
                                            <FormField
                                                control={form.control}
                                                name="typeAppointment"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>
                                                            <span>Tipo de Atendimento</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select defaultValue="in_person" {...field}>
                                                                <SelectTrigger className="w-[210px]">
                                                                    <SelectValue placeholder="Selecione tipo de atendimento" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="in_person">Presencial</SelectItem>
                                                                    <SelectItem value="telephone">Telefónico</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="responsible"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>
                                                            <span>Funcionário Responsável</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="observation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        <span>Observações</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="secondary">
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit">Salvar Atendimento</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="flex gap-6 w-8/12">
                            <Input placeholder="Buscar atendimentos..." />
                            <Select>
                                <SelectTrigger className="w-[255px]">
                                    <SelectValue placeholder="Selecione o período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Atendimentos</SelectItem>
                                    <SelectItem value="today">Hoje</SelectItem>
                                    <SelectItem value="week">Esta Semana</SelectItem>
                                    <SelectItem value="month">Este Mês</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        {eventList.map((event, index) => (
                            <Card className="w-[280px] mt-4" key={index}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>Atendimento</span>
                                        <span className="text-sm text-gray-500">{event.date}, {event.time}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <p className="flex gap-1"><UserIcon />{event.name}</p>
                                    <p className="flex gap-1"><FileIcon />
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="line-clamp-1">
                                                        {event.reason}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{event.reason}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </p>
                                    <p className="flex gap-1">{event.typeAppointment === TypeAppointment.PRESENCIAL ? <MapPin /> : <PhoneIcon />}{event.typeAppointment}</p>
                                    <p className="flex gap-1"><BriefcaseBusinessIcon />{event.responsible}</p>
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
                                                    Esse atendimento será excluído permanentemente e não poderá ser desfeito.
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

export default Proceeding;
