"use client"

import { CheckIcon, ChevronsUpDownIcon, CirclePlus, ClockIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { cn } from "../lib/utils";
import React from "react";
import { Box } from "../components/ui/box";
import { Textarea } from "../components/ui/textarea";
import { AppointmentService } from "../services/appointment.service";
import { Appointment } from "../types/appointment";
import { toast } from "sonner";
import { getAppointmentTypeLabel, TypeAppointment } from "../types/type-appointment";
import { maskitoDateOptionsGenerator, maskitoTimeOptionsGenerator } from "@maskito/kit";
import { useMaskito } from "@maskito/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { UserService } from "../services/user.service";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { AssociateService } from "../services/associate.service";
import { Gender } from "../types/gender";
import { formatDateToISO } from "../util/date.util";

const FormSchema = z.object({
    client: z.string({ required_error: "Campo obrigatório" }),
    reason: z.string({ required_error: "Campo obrigatório", }),
    date: z.string({ required_error: "Campo obrigatório", }),
    time: z.string({ required_error: "Campo obrigatório", }),
    type: z.string({ required_error: "Campo obrigatório", }),
    responsible: z.string({ required_error: "Campo obrigatório", }),
    description: z.string({ required_error: "Campo obrigatório", }),
    clientType: z.string({ required_error: "Campo obrigatório", }),
    gender: z.string({ required_error: "Campo obrigatório", }),
});

const NewAppointment = () => {
    const queryClient = useQueryClient();
    const appointmentService = new AppointmentService();
    const userService = new UserService();
    const associateService = new AssociateService();
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState(false);
    const [clientType, setClientType] = React.useState("associate")
    const [responsible, setResponsible] = React.useState("")
    const [associate, setAssociate] = React.useState("")
    const [comboboxResponsibleOpen, setComboboxResponsibleOpen] = React.useState(false)
    const [comboboxAssociateOpen, setComboboxAssociateOpen] = React.useState(false)
    const timeRef = useMaskito({
        options: maskitoTimeOptionsGenerator({
            mode: 'HH:MM',
        })
    });
    const dateRef = useMaskito({
        options: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '/',
        })
    });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            clientType: "associate",
            gender: "MASCULINE",
        }
    });
    const { data } = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.fetchAll(),
    });
    const { data: associateList } = useQuery({
        queryKey: ['associates-summary'],
        queryFn: () => associateService.fetchSummary(),
    });
    const mutation = useMutation({
        mutationFn: (createRequest: Appointment) => appointmentService.create(createRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            setLoading(false);
            setOpen(false);
            setResponsible("");
            setAssociate("");
            form.reset();
            toast.success("Atendimento criado com sucesso!");
        }
    });

    const handleClientType = (value: string) => {
        setClientType(value);
        form.setValue("clientType", value);
        form.setValue("client", "");
        setAssociate("");
    }

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
            date: formatDateToISO(data.date),
            time: data.time,
            type: data.type.toUpperCase() as TypeAppointment,
            reason: data.reason,
            responsible: data.responsible,
            description: data.description,
            associate: data.clientType === "associate" ? true : false,
        };
        mutation.mutate(appointmentData);
    }

    const resetCreateAppointment = () => {
        setResponsible("");
        setAssociate("");
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) resetCreateAppointment();
            setOpen(open);
        }}>
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
                                                                            form.setValue("gender", associateList.find((associateItem) => associateItem.id === currentValue)!.gender!);
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
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Data</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                ref={dateRef}
                                                onInput={(e) => {
                                                    form.setValue("date", e.currentTarget.value);
                                                }} />
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
                                            <Select onValueChange={(value: string) => form.setValue("type", value)} {...field}>
                                                <SelectTrigger className="w-[210px]">
                                                    <SelectValue placeholder="Selecione tipo de atendimento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(TypeAppointment).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {getAppointmentTypeLabel(value)}
                                                        </SelectItem>
                                                    ))}
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
                                            <Popover open={comboboxResponsibleOpen} onOpenChange={setComboboxResponsibleOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="w-full justify-between"
                                                    >
                                                        {responsible
                                                            ? data != null && data.find((user) => user.fullName === responsible)?.fullName
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
                                                                            setResponsible(currentValue === responsible ? "" : currentValue);
                                                                            setComboboxResponsibleOpen(false);
                                                                            form.setValue("responsible", user.id!);
                                                                        }}
                                                                    >
                                                                        <CheckIcon
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                responsible === user.fullName ? "opacity-100" : "opacity-0"
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
                                {loading ? <Spinner size='small' /> : "Salvar Atendimento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
};

export default NewAppointment;
