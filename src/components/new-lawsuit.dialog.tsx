"use client"

import { CheckIcon, ChevronsUpDownIcon, CirclePlus } from "lucide-react";
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
import { Textarea } from "../components/ui/textarea";
import { LawsuitStatus } from "../types/lawsuit-status";
import { getLawsuitOrderTypeByValue, getLawsuitOrderTypeEnum, LawsuitOrderType } from "../types/lawsuit-order-type";
import { DocumentType } from "../types/document-type";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssociateService } from "../services/associate.service";
import { UserService } from "../services/user.service";
import { LawsuitService } from "../services/lawsuit.service";
import { Lawsuit } from "../types/lawsuit";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { formatDateToISO } from "../util/date.util";
import { LawsuitType } from "../types/lawsuit-type";
import { FileService } from "../services/file.service";
import { maskitoDateOptionsGenerator } from "@maskito/kit";
import { useMaskito } from "@maskito/react";

const FormSchema = z.object({
    responsible: z.string({ required_error: "Campo obrigatório", }),
    status: z.string({ required_error: "Campo obrigatório", }),
    type: z.string({ required_error: "Campo obrigatório", }),
    client: z.string({ required_error: "Campo obrigatório", }),
    birthday: z.string({ required_error: "Campo obrigatório", }),
    phone: z.string({ required_error: "Campo obrigatório", }),
    email: z.string({ required_error: "Campo obrigatório", }),
    documentType: z.string().optional(),
    document: z.string().optional(),
    emissionDate: z.string().optional(),
    expirationDate: z.string().optional(),
    orderDate: z.string({ required_error: "Campo obrigatório", }),
    deadline: z.string({ required_error: "Campo obrigatório", }),
    observation: z.string({ required_error: "Campo obrigatório", }),
    clientType: z.string({ required_error: "Campo obrigatório", }),
    paymentStatus: z.string({ required_error: "Campo obrigatório", }),
    documentUpload: z.array(z.string()).optional(),
});

const NewLawsuit = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState<boolean>(false);
    const [comboboxResponsibleOpen, setComboboxResponsibleOpen] = React.useState(false)
    const [responsible, setResponsible] = React.useState("");
    const [clientType, setClientType] = React.useState("ASSOCIATE");
    const [comboboxAssociateOpen, setComboboxAssociateOpen] = React.useState(false)
    const [comboboxOpen, setComboboxOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [orderType, setOrderType] = React.useState<LawsuitOrderType>();
    const [files, setFiles] = React.useState<FileList>();
    const userService = new UserService();
    const associateService = new AssociateService();
    const fileService = new FileService();
    const lawsuitService = new LawsuitService();
    const orderDateRef = useMaskito({
        options: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '/',
        })
    });
    const birthdayRef = useMaskito({
        options: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '/',
        })
    });
    const deadlineRef = useMaskito({
        options: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '/',
        })
    });
    const emissionDateRef = useMaskito({
        options: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '/',
        })
    });
    const expirationDateRef = useMaskito({
        options: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '/',
        })
    });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            clientType: "ASSOCIATE",
            paymentStatus: "PAID",
        }
    });
    const [associate, setAssociate] = React.useState("");
    const { data } = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.fetchAll(),
    });
    const { data: associateList } = useQuery({
        queryKey: ['associates-summary'],
        queryFn: () => associateService.fetchSummary(),
    });

    const mutation = useMutation({
        mutationFn: (createRequest: Lawsuit) => lawsuitService.create(createRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lawsuits'] });
            setResponsible("");
            setAssociate("");
            setLoading(false);
            form.reset();
            toast.success("Processo criado com sucesso!");
            setOpen(false);
        }
    });

    const handleClientType = (value: string) => {
        setClientType(value);
        form.setValue("clientType", value);
        form.setValue("client", "");
        form.setValue("birthday", "");
        form.setValue("phone", "");
        form.setValue("email", "");
        form.setValue("documentType", "");
        form.setValue("document", "");
        form.setValue("emissionDate", "");
        form.setValue("expirationDate", "");
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
        const appointmentData: Lawsuit = {
            client: data.client,
            birthday: formatDateToISO(data.birthday),
            phone: data.phone,
            email: data.email,
            documentType: data.documentType,
            document: data.document,
            documentEmissionDate: data.emissionDate ? formatDateToISO(data.emissionDate) : undefined,
            documentExpirationDate: data.expirationDate ? formatDateToISO(data.expirationDate) : undefined,
            orderDate: formatDateToISO(data.orderDate),
            deadline: formatDateToISO(data.deadline),
            description: data.observation,
            status: data.status as LawsuitStatus,
            responsible: data.responsible,
            orderType: getLawsuitOrderTypeEnum(data.type) as LawsuitOrderType,
            paymentStatus: data.paymentStatus,
            type: data.clientType as LawsuitType,
            fileNames: data.documentUpload && data.documentUpload.length > 0 ? data.documentUpload : [],
        };
        const formData = new FormData();
        if (files) {
            Array.from(files).forEach((file) => {
                formData.append('files', file);
            });
            await fileService.upload(formData);
        }
        mutation.mutate(appointmentData);
    }

    const resetCreateLawsuit = () => {
        setClientType("associate");
        setResponsible("");
        setAssociate("");
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) resetCreateLawsuit();
            setOpen(open);
        }}>
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
                                                    <RadioGroupItem value="ASSOCIATE" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Sócio
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="NON_ASSOCIATE" />
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
                        <FormField
                            control={form.control}
                            name="paymentStatus"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        <span>Status de Pagamento</span>
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={(value) => form.setValue("paymentStatus", value)} className="grid-flow-col" value={field.value}>
                                            <FormItem className="flex items-center space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="PAID" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Pago
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="NOT_PAID" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Não Pago
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="PENDING" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Pendente
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            clientType === "ASSOCIATE" && <FormField
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
                                                                            form.setValue("client", associateItem.fullName);
                                                                            form.setValue("birthday", associateItem.birthday);
                                                                            form.setValue("phone", associateItem.phone);
                                                                            form.setValue("email", associateItem.email);
                                                                            if (associateItem.documentType) {
                                                                                form.setValue("documentType", associateItem.documentType);
                                                                            }
                                                                            if (associateItem.document) {
                                                                                form.setValue("document", associateItem.document);
                                                                            }
                                                                            if (associateItem.documentEmissionDate) {
                                                                                form.setValue("emissionDate", associateItem.documentEmissionDate);
                                                                            }
                                                                            if (associateItem.documentExpirationDate) {
                                                                                form.setValue("expirationDate", associateItem.documentExpirationDate);
                                                                            }
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
                            />}
                        <div className="flex gap-10">
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
                                                        <span className="w-[150px] overflow-ellipsis truncate whitespace-nowrap">
                                                            {responsible
                                                                ? data != null && data.find((user) => user.fullName === responsible)?.fullName
                                                                : "Selecione o funcionário"}
                                                        </span>
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
                                                                            setResponsible(currentValue);
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
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Estado do Processo</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value: string) => form.setValue("status", value)} {...field}>
                                                <SelectTrigger className="w-[210px]">
                                                    <SelectValue placeholder="Selecione o estado do processo" />
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
                            render={() => (
                                <FormItem>
                                    <FormLabel>
                                        <span>Tipo de Pedido</span>
                                    </FormLabel>
                                    <FormControl>
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={() => (
                                                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={open}
                                                            className="w-full justify-between"
                                                        >
                                                            {orderType
                                                                ? Object.entries(LawsuitOrderType).find((lawsuitStatus) => lawsuitStatus[1] === orderType)?.[1]
                                                                : "Selecione o tipo de pedido"}
                                                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[460px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Busque por tipo de pedido..." />
                                                            <CommandList>
                                                                <CommandEmpty>Nenhum tipo de pedido encontrado</CommandEmpty>
                                                                <CommandGroup>
                                                                    {Object.entries(LawsuitOrderType).map((lawsuitOrderType) => (
                                                                        <CommandItem
                                                                            key={lawsuitOrderType[1]}
                                                                            value={lawsuitOrderType[1]}
                                                                            onSelect={(currentValue) => {
                                                                                setOrderType(getLawsuitOrderTypeByValue(currentValue));
                                                                                setComboboxOpen(false);
                                                                                form.setValue("type", currentValue);
                                                                            }}
                                                                        >
                                                                            <CheckIcon
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    orderType === lawsuitOrderType[1] ? "opacity-100" : "opacity-0"
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
                        {
                            clientType === "NON_ASSOCIATE" && (<div className="flex gap-10">
                                <FormField
                                    control={form.control}
                                    name="client"
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
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Data de nascimento</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    ref={birthdayRef}
                                                    onInput={(e) => {
                                                        form.setValue("birthday", e.currentTarget.value);
                                                    }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            )
                        }
                        {clientType === "NON_ASSOCIATE" && (
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
                        )}
                        {clientType === "NON_ASSOCIATE" && (<div className="flex gap-10">
                            <FormField
                                control={form.control}
                                name="documentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Tipo de Documento</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value: string) => form.setValue("documentType", value)} {...field}>
                                                <SelectTrigger className="w-[210px]">
                                                    <SelectValue placeholder="Selecione tipo de documento" />
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
                        </div>)}
                        {
                            clientType === "NON_ASSOCIATE" && (<div className="flex gap-10">
                                <FormField
                                    control={form.control}
                                    name="emissionDate"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Data de Emissão</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    ref={emissionDateRef}
                                                    onInput={(e) => {
                                                        form.setValue("emissionDate", e.currentTarget.value);
                                                    }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="expirationDate"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Data de Validade</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    ref={expirationDateRef}
                                                    onInput={(e) => {
                                                        form.setValue("expirationDate", e.currentTarget.value);
                                                    }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>)
                        }
                        <div className="flex gap-10">
                            <FormField
                                control={form.control}
                                name="orderDate"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Data de Entrada do Pedido</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                ref={orderDateRef}
                                                onInput={(e) => {
                                                    form.setValue("orderDate", e.currentTarget.value);
                                                }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="deadline"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Data de Entrega ao Cliente</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                ref={deadlineRef}
                                                onInput={(e) => {
                                                    form.setValue("deadline", e.currentTarget.value);
                                                }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="documentUpload"
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span>Documentos Necessários</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...fieldProps} multiple type="file" onChange={(event) => {
                                            if (event.target.files) {
                                                onChange(Array.from(event.target.files).map((file) => file.name));
                                                setFiles(event.target.files);
                                            }
                                        }
                                        } />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                {loading ? <Spinner size='small' /> : "Salvar Processo"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default NewLawsuit;
