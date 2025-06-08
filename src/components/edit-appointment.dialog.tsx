"use client"

import { CalendarIcon, CheckIcon, ChevronsUpDownIcon, ClockIcon, PenIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "../lib/utils";
import React from "react";
import { format } from "date-fns";
import { Box } from "./ui/box";
import { Textarea } from "./ui/textarea";
import { pt } from "date-fns/locale";
import { formatFullDatePtBr } from "../util/date.util";
import { AppointmentService } from "../services/appointment.service";
import { Appointment } from "../types/appointment";
import { toast } from "sonner";
import { TypeAppointment } from "../types/type-appointment";
import { maskitoTimeOptionsGenerator } from "@maskito/kit";
import { useMaskito } from "@maskito/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { UserService } from "../services/user.service";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Gender } from "../types/gender";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { AssociateService } from "../services/associate.service";

const FormSchema = z.object({
    client: z.string({ required_error: "Campo obrigatório" }),
    reason: z.string({ required_error: "Campo obrigatório", }),
    date: z.string({ required_error: "Campo obrigatório", }),
    time: z.string({ required_error: "Campo obrigatório", }),
    type: z.string({ required_error: "Campo obrigatório", }),
    responsible: z.string({ required_error: "Campo obrigatório", }),
    description: z.string({ required_error: "Campo obrigatório", }),
    gender: z.string({ required_error: "Campo obrigatório", }),
    clientType: z.string({ required_error: "Campo obrigatório", }),
});

const EditAppointment = ({ appointment }: { appointment: Appointment }) => {
    const queryClient = useQueryClient();
    const appointmentService = new AppointmentService();
    const userService = new UserService();
    const associateService = new AssociateService();
    const [open, setOpen] = React.useState<boolean>(false);
    const [date, setDate] = React.useState<Date>(new Date(appointment.date));
    const [loading, setLoading] = React.useState(false);
    const [value, setValue] = React.useState(appointment.responsible);
    const [clientType, setClientType] = React.useState(appointment.associate == true ? "associate" : "non-associate");
    const [associate, setAssociate] = React.useState("");
    const [comboboxOpen, setComboboxOpen] = React.useState(false);
    const [comboboxAssociateOpen, setComboboxAssociateOpen] = React.useState(false)
    const timeRef = useMaskito({
        options: maskitoTimeOptionsGenerator({
            mode: 'HH:MM',
        })
    });
    const { data, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.fetchAll(),
    });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            client: appointment.client,
            date: appointment.date,
            time: appointment.time,
            reason: appointment.reason,
            description: appointment.description,
            responsible: isLoading ? "" : data!.find((user) => user.fullName === appointment.responsible)?.id,
            gender: appointment.gender,
            type: appointment.type.toUpperCase() as TypeAppointment,
            clientType: appointment.associate == true ? "associate" : "non-associate",
        }
    });
    const { data: associateList } = useQuery({
        queryKey: ['associates-summary'],
        queryFn: () => associateService.fetchSummary(),
    });
    const mutation = useMutation({
        mutationFn: (updateRequest: Appointment) => appointmentService.update(appointment.id!, updateRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            setLoading(false);
            setOpen(false);
            toast.success("Atendimento atualizado com sucesso!");
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = await form.trigger();
        if (!isValid) {
            return;
        }
        setLoading(true);
        const data = form.getValues();
        const appointmentData: Appointment = {
            client: data.client,
            gender: data.gender as Gender,
            date: data.date,
            time: data.time,
            type: data.type.toUpperCase() as TypeAppointment,
            reason: data.reason,
            responsible: data.responsible,
            description: data.description,
            associate: clientType === 'associate' ? true : false,
        };
        mutation.mutate(appointmentData);
    }

    const resetCreateAppointment = () => {
        setDate(new Date(appointment.date));
        setValue(appointment.responsible);
        form.reset();
    }

    const handleClientType = (value: string) => {
        setClientType(value);
        form.setValue("clientType", value);
        form.setValue("client", "");
        setAssociate("");
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) resetCreateAppointment();
            setOpen(open);
        }}>
            <DialogTrigger>
                <Button variant="outline">
                    <PenIcon />
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Atendimento</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="clientType"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        <span>Tipo de Atendimento</span>
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={handleClientType} className="grid-flow-col" value={field.value}>
                                            <FormItem className="flex items-center space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="associate" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Sócio
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="non-associate" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Não Sócio
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-10">
                            {clientType === 'associate' ? <FormField
                                control={form.control}
                                name="client"
                                render={() => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Sócio</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Popover open={comboboxAssociateOpen} onOpenChange={setComboboxAssociateOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="w-full justify-between"
                                                    >
                                                        {associate
                                                            ? associateList != null && `${associateList.find((associateItem) => associateItem.id === associate)?.fullName} ${associateList.find((associateItem) => associateItem.id === associate)?.phone} `
                                                            : "Selecione o sócio"}
                                                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[465px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Busque por sócios..." />
                                                        <CommandList>
                                                            <CommandEmpty>Nenhum sócio encontrado</CommandEmpty>
                                                            <CommandGroup>
                                                                {associateList != null && associateList.map((associateItem) => (
                                                                    <CommandItem
                                                                        key={associateItem.id}
                                                                        value={associateItem.id}
                                                                        onSelect={(currentValue) => {
                                                                            setAssociate(currentValue);
                                                                            setComboboxAssociateOpen(false);
                                                                            form.setValue("gender", associateList.find((associateItem) => associateItem.fullName === currentValue)!.gender!);
                                                                            form.setValue("client", associateItem.fullName);
                                                                        }}
                                                                    >
                                                                        <CheckIcon
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                associate === associateItem.fullName ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {associateItem.fullName} {associateItem.phone}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                                : <FormField
                                    control={form.control}
                                    name="client"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Nome</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />}
                            {clientType === 'non-associate' && <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Género</span>
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup className="grid-flow-col" value={field.value} onValueChange={(value) => form.setValue("gender", value)}>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="MASCULINE" id="masculine" />
                                                    <Label htmlFor="masculine">Masculino</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="FEMININE" id="feminine" />
                                                    <Label htmlFor="feminine">Feminino</Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />}
                        </div>
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
                                                        {date ? formatFullDatePtBr(date) : <span>Selecione uma data</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        locale={pt}
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={(date) => {
                                                            setDate(date!);
                                                            field.onChange(format(date!, "yyyy-MM-dd"));
                                                        }}
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
                                                    ref={timeRef}
                                                    onInput={(e) => {
                                                        form.setValue("time", e.currentTarget.value);
                                                    }}
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
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Tipo de Atendimento</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(e: string) => form.setValue("type", e)} {...field}>
                                                <SelectTrigger className="w-[210px]">
                                                    <SelectValue placeholder="Selecione tipo de atendimento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                                                    <SelectItem value="TELEPHONE">Telefónico</SelectItem>
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
                                render={() => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Funcionário Responsável</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="w-full justify-between"
                                                    >
                                                        {value
                                                            ? data != null && data.find((user) => user.fullName === value)?.fullName
                                                            : "Selecione o funcionário"}
                                                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[210px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Busque por funcionários..." />
                                                        <CommandList>
                                                            <CommandEmpty>Nenhum funcionário encontrado</CommandEmpty>
                                                            <CommandGroup>
                                                                {data != null && data.map((user) => (
                                                                    <CommandItem
                                                                        key={user.id}
                                                                        value={user.fullName}
                                                                        onSelect={(currentValue) => {
                                                                            setValue(currentValue === value ? "" : currentValue);
                                                                            setComboboxOpen(false);
                                                                            form.setValue("responsible", user.id!);
                                                                        }}
                                                                    >
                                                                        <CheckIcon
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                value === user.fullName ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {user.fullName}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
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
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                {loading ? <Spinner size='small' /> : "Atualizar Atendimento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
};

export default EditAppointment;
