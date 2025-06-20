"use client"

import { CheckIcon, ChevronsUpDownIcon, FileIcon, Loader2Icon, PenIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";
import React from "react";
import { Textarea } from "./ui/textarea";
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
import { LawsuitType } from "../types/lawsuit-type";
import { FileService } from "../services/file.service";
import { maskitoDateOptionsGenerator } from "@maskito/kit";
import { useMaskito } from "@maskito/react";
import { formatDateToISO, formatDateToPtBr } from "../util/date.util";

const FormSchema = z.object({
    responsible: z.string({ required_error: "Campo obrigatório", }),
    status: z.string({ required_error: "Campo obrigatório", }),
    type: z.string({ required_error: "Campo obrigatório", }),
    client: z.string({ required_error: "Campo obrigatório", }),
    birthday: z.string({ required_error: "Campo obrigatório", }),
    phone: z.string({ required_error: "Campo obrigatório", }),
    email: z.string({ required_error: "Campo obrigatório", }),
    documentType: z.string().optional().nullable(),
    document: z.string().optional().nullable(),
    emissionDate: z.string().optional(),
    expirationDate: z.string().optional(),
    orderDate: z.string({ required_error: "Campo obrigatório", }),
    deadline: z.string({ required_error: "Campo obrigatório", }),
    observation: z.string().optional(),
    clientType: z.string({ required_error: "Campo obrigatório", }),
    paymentStatus: z.string({ required_error: "Campo obrigatório", }),
    documentUpload: z.array(z.string()).optional(),
    orderTypeDescription: z.string().optional(),
});

const EditLawsuit = ({ lawsuit }: { lawsuit: Lawsuit }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState<boolean>(false);
    const [comboboxResponsibleOpen, setComboboxResponsibleOpen] = React.useState(false)
    const [responsible, setResponsible] = React.useState(lawsuit.responsible);
    const [clientType, setClientType] = React.useState(lawsuit.type);
    const [comboboxAssociateOpen, setComboboxAssociateOpen] = React.useState(false)
    const [comboboxOpen, setComboboxOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [loadingMap, setLoadingMap] = React.useState<Record<string, boolean>>({});
    const [orderType, setOrderType] = React.useState<LawsuitOrderType>(LawsuitOrderType[lawsuit.orderType as keyof typeof LawsuitOrderType]);
    const [associate, setAssociate] = React.useState(lawsuit.client);
    const [fileNames, setFileNames] = React.useState<string[]>(lawsuit.fileNames);
    const [files, setFiles] = React.useState<FileList>();
    const [orderTypeDescriptionShown, setOrderTypeDescriptionShown] = React.useState<boolean>(lawsuit.orderTypeDescription !== undefined && lawsuit.orderTypeDescription !== null && lawsuit.orderTypeDescription !== "");
    const userService = new UserService();
    const associateService = new AssociateService();
    const lawsuitService = new LawsuitService();
    const fileService = new FileService();
    const { data } = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.fetchAll(),
    });
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
            clientType: lawsuit.type,
            paymentStatus: lawsuit.paymentStatus,
            responsible: data != null && data.find((user) => user.fullName === lawsuit.responsible)?.id || "",
            status: lawsuit.status,
            type: lawsuit.orderType,
            client: lawsuit.client,
            birthday: lawsuit.birthday ? formatDateToPtBr(new Date(lawsuit.birthday)) : undefined,
            phone: lawsuit.phone,
            email: lawsuit.email,
            documentType: lawsuit.documentType,
            document: lawsuit.document,
            emissionDate: lawsuit.documentEmissionDate ? formatDateToPtBr(new Date(lawsuit.documentEmissionDate)) : undefined,
            expirationDate: lawsuit.documentExpirationDate ? formatDateToPtBr(new Date(lawsuit.documentExpirationDate)) : undefined,
            orderDate: formatDateToPtBr(new Date(lawsuit.orderDate)),
            deadline: formatDateToPtBr(new Date(lawsuit.deadline)),
            observation: lawsuit.description ?? '',
            orderTypeDescription: lawsuit.orderTypeDescription,
        }
    });
    const { data: associateList } = useQuery({
        queryKey: ['associates-summary'],
        queryFn: () => associateService.fetchSummary(),
    });

    const mutation = useMutation({
        mutationFn: (createRequest: Lawsuit) => lawsuitService.update(lawsuit.id!, createRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lawsuits'] });
            setLoading(false);
            toast.success("Processo atualizado com sucesso!");
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
            documentType: data.documentType == "" ? undefined : data.documentType!,
            document: data.document == "" ? undefined : data.document!,
            documentEmissionDate: data.emissionDate ? formatDateToISO(data.emissionDate!) : undefined,
            documentExpirationDate: data.expirationDate ? formatDateToISO(data.expirationDate!) : undefined,
            orderDate: formatDateToISO(data.orderDate),
            deadline: formatDateToISO(data.deadline),
            description: data.observation,
            status: data.status as LawsuitStatus,
            responsible: data.responsible,
            orderType: data.type as LawsuitOrderType,
            paymentStatus: data.paymentStatus,
            type: data.clientType as LawsuitType,
            fileNames: fileNames,
            orderTypeDescription: data.orderTypeDescription,
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
        setClientType(lawsuit.type);
        setResponsible(lawsuit.responsible);
        setAssociate(lawsuit.client);
        setOrderType(LawsuitOrderType[lawsuit.orderType as keyof typeof LawsuitOrderType]);
        form.reset();
    }

    const handleFileDownload = async (file: string) => {
        setLoadingMap((prev) => ({ ...prev, [file]: true }));
        const response = await fileService.download(file);
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoadingMap((prev) => ({ ...prev, [file]: false }));
    }

    const handleFileDelete = async (file: string) => {
        const filteredFiles = Array.from(files || []).filter((f) => f.name !== file);
        const dataTransfer = new DataTransfer();
        filteredFiles.forEach((f) => dataTransfer.items.add(f));
        setFiles(dataTransfer.files);
        setFileNames((prev) => prev.filter((f) => f !== file));
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) resetCreateLawsuit();
            setFileNames(lawsuit.fileNames);
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
                    <DialogTitle>Editar Processo</DialogTitle>
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
                                                            ? associateList != null && `${associateList.find((associateItem) => associateItem.fullName === associate)?.fullName} ${associateList.find((associateItem) => associateItem.fullName === associate)?.phone} `
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
                                                                        value={associateItem.fullName}
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
                                                        <span className="w-[150px] overflow-ellipsis truncate whitespace-nowrap text-start">
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
                                                                                setOrderType(getLawsuitOrderTypeByValue(currentValue) ?? orderType);
                                                                                setComboboxOpen(false);
                                                                                form.setValue("type", getLawsuitOrderTypeEnum(currentValue)!.toString());
                                                                                if (currentValue === "Outros pedidos") {
                                                                                    setOrderTypeDescriptionShown(true);
                                                                                } else {
                                                                                    setOrderTypeDescriptionShown(false);
                                                                                    form.setValue("orderTypeDescription", "");
                                                                                }
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
                        {orderTypeDescriptionShown && (
                            <FormField
                                control={form.control}
                                name="orderTypeDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Descrição do Tipo de Pedido</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
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
                                                <Input {...field} value={field.value ?? ""} />
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
                                                <Input {...field} value={field.value ?? ""} />
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
                                                <Input {...field} value={field.value ?? ""} />
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
                                            <Select onValueChange={(value: string) => form.setValue("documentType", value)} value={field.value as string | undefined}>
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
                                            <Input {...field} value={field.value ?? ""} />
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
                                        <span>Arquivos</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...fieldProps} multiple type="file" onChange={(event) => {
                                            if (event.target.files) {
                                                onChange(Array.from(event.target.files).map((file) => file.name));
                                                setFileNames([...fileNames, ...Array.from(event.target.files).map((file) => file.name)]);
                                                setFiles(event.target.files);
                                            }
                                        }} />
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
                        <div className="flex flex-col gap-2">
                            {fileNames.map((fileName, index) => (
                                <div key={index} className="flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <FileIcon />
                                        <span className="text-sm">{fileName}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Button type="button" onClick={() => handleFileDownload(fileName)} variant="link" disabled={loadingMap[fileName]}>
                                            {loadingMap[fileName] ? <Loader2Icon className="animate-spin" /> : "Baixar"}
                                        </Button>
                                        <Button className="w-8 h-8" type="button" onClick={() => handleFileDelete(fileName)} variant="destructive" disabled={loadingMap[fileName]}>
                                            <XIcon />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                {loading ? <Spinner size='small' /> : "Atualizar Processo"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditLawsuit;
