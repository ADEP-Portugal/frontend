"use client"

import { CirclePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { EducationLevel } from "../types/education-level";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { AreaInterest } from "../types/area-interest";
import { JobStatus } from "../types/job-status";
import { ScrollArea } from "./ui/scroll-area";
import { AssociateService } from "../services/associate.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Associate } from "../types/associate";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { formatDateToISO } from "../util/date.util";
import { DocumentType } from "../types/document-type";
import { maskitoDateOptionsGenerator } from "@maskito/kit";
import { useMaskito } from "@maskito/react";

const FormSchema = z.object({
    name: z.string({ required_error: "Campo obrigatório", }),
    email: z.string({ required_error: "Campo obrigatório", }),
    gender: z.string().optional(),
    address: z.string().optional(),
    phone: z.string({ required_error: "Campo obrigatório" }).regex(/^\d+$/, "O número de telefone deve conter apenas dígitos"),
    birthday: z.string({ required_error: "Campo obrigatório", }),
    nationality: z.string().optional(),
    education: z.string().optional(),
    motherLanguage: z.string().optional(),
    availabilityToWork: z.string().optional(),
    profissionalExperience: z.string().optional(),
    areaInterest: z.string().optional(),
    employeeNumber: z.string().optional(),
    validityCardDate: z.string().optional(),
    quotaStatus: z.string().optional(),
    documentType: z.string().optional(),
    document: z.string().optional(),
    validityDocumentDate: z.string().optional(),
    jobStatus: z.string().optional(),
    nif: z.string().optional(),
})

const NewAssociate = () => {
    const [availabilityToWork, setAvailabilityToWork] = React.useState<string[]>([]);
    const [areaInterest, setAreaInterest] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState<boolean>(false);
    const queryClient = useQueryClient();
    const birthdayRef = useMaskito({
        options: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '/',
        })
    });
    const validityCardDateRef = useMaskito({
        options: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '/',
        })
    });
    const validityDocumentDateRef = useMaskito({
        options: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '/',
        })
    });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            gender: "MASCULINE",
            quotaStatus: "PENDING",
        }
    });
    const associateService = new AssociateService();
    const mutation = useMutation({
        mutationFn: (createRequest: Associate) => associateService.create(createRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['associates'] });
            form.reset();
            toast.success("Associado criado com sucesso!");
            setOpen(false);
            setLoading(false);
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
        const associateData: Associate = {
            fullName: data.name,
            email: data.email,
            gender: data.gender,
            phone: data.phone,
            birthday: formatDateToISO(data.birthday),
            nationality: data.nationality,
            educationLevel: data.education,
            address: data.address,
            quotaStatus: data.quotaStatus,
            nif: data.nif,
            documentType: data.documentType as DocumentType,
            document: data.document,
            associateNumber: data.employeeNumber,
            cardExpirationDate: data.validityCardDate ? formatDateToISO(data.validityCardDate) : undefined,
            documentExpirationDate: data.validityDocumentDate ? formatDateToISO(data.validityDocumentDate) : undefined,
            employmentStatus: data.jobStatus,
            motherLanguage: data.motherLanguage,
            availabilityToWork: availabilityToWork,
            areaInterest: areaInterest,
            profissionalExperience: data.profissionalExperience,
        };
        mutation.mutate(associateData);
    }

    const resetCreateAssociate = () => {
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) resetCreateAssociate();
            setOpen(open);
        }}>
            <DialogTrigger>
                <Button>
                    <CirclePlus />
                    Adicionar Associado
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px] px-0">
                <DialogHeader className="px-6">
                    <DialogTitle>Adicionar Novo Associado</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[700px] px-6">
                    <Form {...form}>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                            <div className="flex gap-10">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Nome Completo*</span>
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
                                                <span>Email*</span>
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
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Género</span>
                                            </FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={(value) => form.setValue("gender", value)} className="grid-flow-col" {...field}>
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
                                />
                            </div>
                            <div className="flex gap-10">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Número de Telemóvel*</span>
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
                                                <span>Data de Nascimento*</span>
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
                                <FormField
                                    control={form.control}
                                    name="nationality"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Nacionalidade</span>
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
                                    name="education"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <span>Escolaridade</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={(value: string) => form.setValue("education", value)} {...field}>
                                                    <SelectTrigger className="w-[240px]">
                                                        <SelectValue placeholder="Selecione a escolaridade" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(EducationLevel).map(([key, value]) => (
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
                                    name="motherLanguage"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Domínio da Língua Materna</span>
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
                                    name="availabilityToWork"
                                    render={() => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Disponibilidade para Trabalhar</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex gap-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox onCheckedChange={(value) => value == true ? setAvailabilityToWork(prev => [...prev, "MORNING"]) : setAvailabilityToWork(prev => prev.filter(item => item !== "MORNING"))} id="morning" />
                                                        <label
                                                            htmlFor="morning"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            Manhã
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox onCheckedChange={(value) => value == true ? setAvailabilityToWork(prev => [...prev, "AFTERNOON"]) : setAvailabilityToWork(prev => prev.filter(item => item !== "AFTERNOON"))} id="afternoon" />
                                                        <label
                                                            htmlFor="afternoon"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            Tarde
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox onCheckedChange={(value) => value == true ? setAvailabilityToWork(prev => [...prev, "NIGHT"]) : setAvailabilityToWork(prev => prev.filter(item => item !== "NIGHT"))} id="night" />
                                                        <label
                                                            htmlFor="night"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            Noite
                                                        </label>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Morada</span>
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
                                name="profissionalExperience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Experiência Profissional</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="areaInterest"
                                render={() => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Área de Interesse</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-4 gap-3">
                                                {Object.entries(AreaInterest).map(([key, value]) => (
                                                    <div key={key} className="flex items-center space-x-2">
                                                        <Checkbox onCheckedChange={(valueCheck) => valueCheck == true ? setAreaInterest(prev => [...prev, key]) : setAreaInterest(prev => prev.filter(item => item !== key))} id={value} />
                                                        <label
                                                            htmlFor={value}
                                                            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {value}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-10">
                                <FormField
                                    control={form.control}
                                    name="employeeNumber"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Número de Sócio</span>
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
                                    name="validityCardDate"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Validade do Cartão</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    ref={validityCardDateRef}
                                                    onInput={(e) => {
                                                        form.setValue("validityCardDate", e.currentTarget.value);
                                                    }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="quotaStatus"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Estado da Cota</span>
                                            </FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={(value) => form.setValue("quotaStatus", value)} className="grid-flow-col" {...field}>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="PAID" id="paid" />
                                                        <Label htmlFor="paid">Paga</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="PENDING" id="pending" />
                                                        <Label htmlFor="pending">Pendente</Label>
                                                    </div>
                                                </RadioGroup>
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
                                                <Select onValueChange={(value: string) => form.setValue("documentType", value)} {...field}>
                                                    <SelectTrigger className="w-[240px]">
                                                        <SelectValue placeholder="Selecione o tipo de documento" />
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
                                <FormField
                                    control={form.control}
                                    name="validityDocumentDate"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Data de validade</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    ref={validityDocumentDateRef}
                                                    onInput={(e) => {
                                                        form.setValue("validityDocumentDate", e.currentTarget.value);
                                                    }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex gap-10">
                                <FormField
                                    control={form.control}
                                    name="jobStatus"
                                    render={({ field }) => (
                                        <FormItem className="w-[240px]">
                                            <FormLabel>
                                                <span>Situação face ao Emprego</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={(value: string) => form.setValue("jobStatus", value)} {...field}>
                                                    <SelectTrigger className="w-[240px]">
                                                        <SelectValue placeholder="Selecione a situação de emprego" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(JobStatus).map(([key, value]) => (
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
                                    name="nif"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>NIF</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="px-6">
                                <DialogClose asChild>
                                    <Button variant="secondary">
                                        Cancelar
                                    </Button>
                                </DialogClose>
                                <Button type="submit">
                                    {loading ? <Spinner size='small' /> : "Salvar Associado"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default NewAssociate;
