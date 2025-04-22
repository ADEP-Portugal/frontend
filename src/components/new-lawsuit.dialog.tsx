"use client"

import { CalendarIcon, CheckIcon, ChevronsUpDownIcon, CirclePlus } from "lucide-react";
import { Button } from "../components/ui/button";
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
import { Textarea } from "../components/ui/textarea";
import { LawsuitStatus } from "../types/lawsuit-status";
import { getLawsuitOrderTypeByValue, LawsuitOrderType } from "../types/lawsuit-order-type";
import { DocumentType } from "../types/document-type";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

const FormSchema = z.object({
    responsible: z.string({ required_error: "Campo obrigatório", }),
    status: z.string({ required_error: "Campo obrigatório", }),
    type: z.string({ required_error: "Campo obrigatório", }),
    name: z.string({ required_error: "Campo obrigatório", }),
    birthday: z.string({ required_error: "Campo obrigatório", }),
    phone: z.string({ required_error: "Campo obrigatório", }),
    email: z.string({ required_error: "Campo obrigatório", }),
    documentType: z.string({ required_error: "Campo obrigatório", }),
    document: z.string({ required_error: "Campo obrigatório", }),
    emissionDate: z.string({ required_error: "Campo obrigatório", }),
    expirationDate: z.string({ required_error: "Campo obrigatório", }),
    orderDate: z.string({ required_error: "Campo obrigatório", }),
    deadline: z.string({ required_error: "Campo obrigatório", }),
    observation: z.string({ required_error: "Campo obrigatório", }),
})

const NewLawsuit = () => {
    const [birthday, setBirthday] = React.useState<Date>()
    const [emissionDate, setEmissionDate] = React.useState<Date>()
    const [expirationDate, setExpirationDate] = React.useState<Date>()
    const [orderDate, setOrderDate] = React.useState<Date>()
    const [deadline, setDeadline] = React.useState<Date>()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })
    const [comboboxOpen, setComboboxOpen] = React.useState(false)
    const [value, setValue] = React.useState<LawsuitOrderType>()

    return (
        <Dialog>
            <DialogTrigger>
                <Button>
                    <CirclePlus />
                    Adicionar Processo
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Processo</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-4 py-4">
                        <div className="flex gap-10">
                            <FormField
                                control={form.control}
                                name="responsible"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Nome do Responsável</span>
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
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Estado do Processo</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select defaultValue="in_person" {...field}>
                                                <SelectTrigger className="w-[210px]">
                                                    <SelectValue placeholder="Selecione tipo de pedido" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(LawsuitStatus).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {value}
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
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span>Tipo de Pedido</span>
                                    </FormLabel>
                                    <FormControl>
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={open}
                                                            className="w-full justify-between"
                                                        >
                                                            {value
                                                                ? Object.entries(LawsuitOrderType).find((lawsuitStatus) => lawsuitStatus[1] === value)?.[1]
                                                                : "Selecione o tipo de pedido"}
                                                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[460px] p-0">
                                                        <Command>
                                                            <CommandInput  placeholder="Busque por tipo de pedido..." />
                                                            <CommandList>
                                                                <CommandEmpty>Nenhum tipo de pedido encontrado</CommandEmpty>
                                                                <CommandGroup>
                                                                    {Object.entries(LawsuitOrderType).map((lawsuitOrderType) => (
                                                                        <CommandItem
                                                                            key={lawsuitOrderType[1]}
                                                                            value={lawsuitOrderType[1]}
                                                                            onSelect={(currentValue) => {
                                                                                setValue(getLawsuitOrderTypeByValue(currentValue))
                                                                                setComboboxOpen(false)
                                                                            }}
                                                                        >
                                                                            <CheckIcon
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    value === lawsuitOrderType[1] ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {lawsuitOrderType[1]}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-10">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Nome do interessado</span>
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
                                name="birthday"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Data de nascimento</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[210px] justify-start text-left font-normal",
                                                            !birthday && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {birthday ? format(birthday, "PPP") : <span>Selecione uma data</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={birthday}
                                                        onSelect={setBirthday}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-10">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Telemóvel</span>
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Email</span>
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
                                name="documentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Tipo de Documento</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select defaultValue="in_person" {...field}>
                                                <SelectTrigger className="w-[210px]">
                                                    <SelectValue placeholder="Selecione tipo de pedido" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(DocumentType).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {value}
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
                                name="document"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Número do Documento</span>
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
                                name="emissionDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Data de Emissão</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[210px] justify-start text-left font-normal",
                                                            !emissionDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {emissionDate ? format(emissionDate, "PPP") : <span>Selecione uma data</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={emissionDate}
                                                        onSelect={setEmissionDate}
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
                                name="expirationDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Data de Validade</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[210px] justify-start text-left font-normal",
                                                            !expirationDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {expirationDate ? format(expirationDate, "PPP") : <span>Selecione uma data</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={expirationDate}
                                                        onSelect={setExpirationDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-10">
                            <FormField
                                control={form.control}
                                name="orderDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Data de Entrada do Pedido</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[210px] justify-start text-left font-normal",
                                                            !orderDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {orderDate ? format(orderDate, "PPP") : <span>Selecione uma data</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={orderDate}
                                                        onSelect={setOrderDate}
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
                                name="deadline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Data de Entrega ao Cliente</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[210px] justify-start text-left font-normal",
                                                            !deadline && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {deadline ? format(deadline, "PPP") : <span>Selecione uma data</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={deadline}
                                                        onSelect={setDeadline}
                                                        initialFocus
                                                    />
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
                    <Button type="submit">Salvar Processo</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewLawsuit;
