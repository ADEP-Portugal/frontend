"use client"

import { CalendarIcon, CheckIcon, ChevronsUpDownIcon, CirclePlus, PenIcon } from "lucide-react";
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
import { Textarea } from "./ui/textarea";
import { getTaskLabel, TaskPriority } from "../types/task-priority";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { pt } from "date-fns/locale";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatFullDatePtBr } from "../util/date.util";
import { LawsuitService } from "../services/lawsuit.service";
import { LawsuitOrderType } from "../types/lawsuit-order-type";
import { UserService } from "../services/user.service";
import { TaskService } from "../services/task.service";
import { Task } from "../types/task";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { format } from "date-fns";

const FormSchema = z.object({
    title: z.string({ required_error: "Campo obrigatório", }),
    responsible: z.string({ required_error: "Campo obrigatório", }),
    lawsuit: z.string().optional(),
    client: z.string({ required_error: "Campo obrigatório", }),
    phone: z.string({ required_error: "Campo obrigatório", }),
    deadline: z.string({ required_error: "Campo obrigatório", }),
    priority: z.string({ required_error: "Campo obrigatório", }),
    description: z.string({ required_error: "Campo obrigatório", }),
})

const EditTask = ({ task }: { task: Task }) => {
    const queryClient = useQueryClient();
    const [deadline, setDeadline] = React.useState<Date>(new Date(task.deadline));
    const [comboboxOpen, setComboboxOpen] = React.useState(false)
    const [comboboxLawsuitOpen, setComboboxLawsuitOpen] = React.useState(false)
    const [responsible, setResponsible] = React.useState(task.responsible);
    const [lawsuitValue, setLawsuitValue] = React.useState(task.lawsuitId);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState<boolean>(false);
    const taskService = new TaskService();
    const lawsuitService = new LawsuitService();
    const userService = new UserService();
    const { data } = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.fetchAll(),
    });
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: task.title,
            responsible: data!.find((user) => user.fullName === task.responsible)?.id,
            lawsuit: task.lawsuitId,
            client: task.client,
            phone: task.phone,
            deadline: format(new Date(task.deadline), "yyyy-MM-dd"),
            priority: task.priority,
            description: task.description,
        }
    });
    const { data: lawsuitList } = useQuery({
        queryKey: ['lawsuits-summary'],
        queryFn: () => lawsuitService.fetchSummary(),
    });

    const mutation = useMutation({
        mutationFn: (createRequest: Task) => taskService.update(task.id!, createRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setLoading(false);
            setOpen(false);
            toast.success("Tarefa atualizada com sucesso!");
            setOpen(false);
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
        const appointmentData: Task = {
            client: data.client,
            phone: data.phone,
            deadline: data.deadline,
            description: data.description,
            title: data.title,
            lawsuitId: data.lawsuit,
            responsible: data.responsible,
            priority: data.priority as TaskPriority,
        };
        mutation.mutate(appointmentData);
    }

    const resetCreateTask = () => {
        setResponsible(task.responsible);
        setDeadline(new Date(task.deadline));
        setLawsuitValue(task.lawsuitId);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) resetCreateTask();
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
                    <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        <span>Título</span>
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
                            name="responsible"
                            render={({ field }) => (
                                <FormItem>
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
                                                    {responsible
                                                        ? data != null && data.find((user) => user.fullName === responsible)?.fullName
                                                        : "Selecione o funcionário"}
                                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[460px] p-0">
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
                                                                        setResponsible(currentValue);
                                                                        setComboboxOpen(false);
                                                                        form.setValue("responsible", user.id);
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
                        <FormField
                            control={form.control}
                            name="lawsuit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span>Processo Relacionado</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Popover open={comboboxLawsuitOpen} onOpenChange={setComboboxLawsuitOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between"
                                                >
                                                    {lawsuitValue
                                                        ? lawsuitList != null && `${lawsuitList.find((lawsuit) => lawsuit.id === lawsuitValue)?.client} - ${LawsuitOrderType[lawsuitList.find((lawsuit) => lawsuit.id === lawsuitValue)?.orderType as keyof typeof LawsuitOrderType]}`
                                                        : "Selecione o processo"}
                                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[460px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Busque por processos..." />
                                                    <CommandList>
                                                        <CommandEmpty>Nenhum funcionário encontrado</CommandEmpty>
                                                        <CommandGroup>
                                                            {lawsuitList != null && lawsuitList.map((lawsuit) => (
                                                                <CommandItem
                                                                    key={lawsuit.id}
                                                                    value={lawsuit.id}
                                                                    onSelect={(currentValue) => {
                                                                        setLawsuitValue(currentValue);
                                                                        setComboboxLawsuitOpen(false);
                                                                        form.setValue("lawsuit", currentValue);
                                                                    }}
                                                                >
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            lawsuitValue === lawsuit.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {lawsuit.client} {LawsuitOrderType[lawsuit.orderType as keyof typeof LawsuitOrderType]}
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
                        <div className="flex gap-10">
                            <FormField
                                control={form.control}
                                name="client"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Nome do Interessado</span>
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
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Número de Telemóvel</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-10">
                            <FormField
                                control={form.control}
                                name="deadline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Data de entrega</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Popover modal>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[215px] justify-start text-left font-normal",
                                                            !deadline && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {deadline ? formatFullDatePtBr(deadline) : <span>Selecione uma data</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        locale={pt}
                                                        mode="single"
                                                        selected={deadline}
                                                        onSelect={(date) => {
                                                            setDeadline(date);
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
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Prioridade</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value: string) => form.setValue("priority", value)} form="priority" {...field}>
                                                <SelectTrigger className="w-[215px]">
                                                    <SelectValue placeholder="Selecione tipo de pedido" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(TaskPriority).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {getTaskLabel(value as TaskPriority)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                        <span>Descrição</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="document"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        <span>Documentos Anexos</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input multiple type="file" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                {loading ? <Spinner size='small' /> : "Atualizar Tarefa"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTask;
