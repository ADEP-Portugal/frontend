"use client"

import { CalendarIcon, PenIcon } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { EducationLevel } from "../types/education-level";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { AreaInterest } from "../types/area-interest";
import { Nationality } from "../types/nationality";
import { JobStatus } from "../types/job-status";
import { ScrollArea } from "./ui/scroll-area";
import { pt } from "date-fns/locale";
import { AssociateService } from "../services/associate.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Associate } from "../types/associate";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { formatFullDatePtBr } from "../util/date.util";
import { DocumentType } from "../types/document-type";

const FormSchema = z.object({
    name: z.string({ required_error: "Campo obrigatório", }),
    email: z.string({ required_error: "Campo obrigatório", }),
    gender: z.string({ required_error: "Campo obrigatório", }),
    address: z.string({ required_error: "Campo obrigatório", }),
    phone: z.string({ required_error: "Campo obrigatório" }).regex(/^\d+$/, "O número de telefone deve conter apenas dígitos"),
    birthday: z.string({ required_error: "Campo obrigatório", }),
    nationality: z.string({ required_error: "Campo obrigatório", }),
    education: z.string({ required_error: "Campo obrigatório", }),
    motherLanguage: z.string().optional(),
    availabilityToWork: z.string().optional(),
    profissionalExperience: z.string().optional(),
    areaInterest: z.string().optional(),
    employeeNumber: z.string().optional(),
    validityCardDate: z.string().optional(),
    quotaStatus: z.string({ required_error: "Campo obrigatório", }),
    documentType: z.string().optional(),
    document: z.string().optional(),
    validityDocumentDate: z.string().optional(),
    jobStatus: z.string().optional(),
    nif: z.string().optional(),
})

const EditAssociate = ({ associate }: { associate: Associate }) => {
    const [birthday, setBirthday] = React.useState<Date>(new Date(associate.birthday));
    const [validityCardDate, setValidityCardDate] = React.useState<Date>(new Date(associate.cardExpirationDate!));
    const [validityDocumentDate, setValidityDocumentDate] = React.useState<Date>(new Date(associate.documentExpirationDate!));
    const [availabilityToWork, setAvailabilityToWork] = React.useState<string[]>(associate.availabilityToWork);
    const [areaInterest, setAreaInterest] = React.useState<string[]>(associate.areaInterest);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState<boolean>(false);
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            gender: associate.gender,
            quotaStatus: associate.quotaStatus,
            name: associate.fullName,
            email: associate.email,
            phone: associate.phone,
            birthday: associate.birthday,
            nationality: associate.nationality,
            education: associate.educationLevel,
            address: associate.address,
            motherLanguage: associate.motherLanguage || undefined,
            jobStatus: associate.employmentStatus || undefined,
            documentType: associate.documentType || undefined,
            document: associate.document || undefined,
            nif: associate.nif || undefined,
            employeeNumber: associate.associateNumber || undefined,
        }
    });
    const associateService = new AssociateService();
    const mutation = useMutation({
        mutationFn: (createRequest: Associate) => associateService.update(associate.id!, createRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['associates'] });
            form.reset();
            toast.success("Associado atualizado com sucesso!");
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
            birthday: data.birthday,
            nationality: data.nationality,
            educationLevel: data.education,
            address: data.address,
            quotaStatus: data.quotaStatus,
            nif: data.nif,
            documentType: data.documentType as DocumentType,
            document: data.document,
            associateNumber: data.employeeNumber,
            cardExpirationDate: data.validityCardDate,
            documentExpirationDate: data.validityDocumentDate,
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
                <Button variant="outline">
                    <PenIcon />
                    Editar
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
                                                <span>Género*</span>
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
                                        <FormItem>
                                            <FormLabel>
                                                <span>Data de Nascimento*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] justify-start text-left font-normal",
                                                                !birthday && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {birthday ? formatFullDatePtBr(birthday) : <span>Selecione uma data</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            locale={pt}
                                                            mode="single"
                                                            selected={birthday}
                                                            onSelect={(date) => {
                                                                setBirthday(date);
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
                                    name="nationality"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <span>Nacionalidade*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={(value: string) => form.setValue("nationality", value)} {...field}>
                                                    <SelectTrigger className="w-[240px]">
                                                        <SelectValue placeholder="Selecione a nacionalidade" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(Nationality).map(([key, value]) => (
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
                            <div className="flex gap-10">
                                <FormField
                                    control={form.control}
                                    name="education"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <span>Escolaridade*</span>
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
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Disponibilidade para Trabalhar</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex gap-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox checked={availabilityToWork.some((value) => value === "MORNING")} onCheckedChange={(value) => value == true ? setAvailabilityToWork(prev => [...prev, "MORNING"]) : setAvailabilityToWork(prev => prev.filter(item => item !== "MORNING"))} id="morning" />
                                                        <label
                                                            htmlFor="morning"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            Manhã
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox checked={availabilityToWork.some((value) => value === "AFTERNOON")} onCheckedChange={(value) => value == true ? setAvailabilityToWork(prev => [...prev, "AFTERNOON"]) : setAvailabilityToWork(prev => prev.filter(item => item !== "AFTERNOON"))} id="afternoon" />
                                                        <label
                                                            htmlFor="afternoon"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            Tarde
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox checked={availabilityToWork.some((value) => value === "NIGHT")} onCheckedChange={(value) => value == true ? setAvailabilityToWork(prev => [...prev, "NIGHT"]) : setAvailabilityToWork(prev => prev.filter(item => item !== "NIGHT"))} id="night" />
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
                                            <span>Morada*</span>
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
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <span>Área de Interesse</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-4 gap-3">
                                                {Object.entries(AreaInterest).map(([key, value]) => (
                                                    <div key={key} className="flex items-center space-x-2">
                                                        <Checkbox checked={areaInterest.some((valueCheck) => valueCheck === key)} onCheckedChange={(valueCheck) => valueCheck == true ? setAreaInterest(prev => [...prev, key]) : setAreaInterest(prev => prev.filter(item => item !== key))} id={value} />
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
                                        <FormItem>
                                            <FormLabel>
                                                <span>Validade do Cartão</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] justify-start text-left font-normal",
                                                                !validityCardDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {validityCardDate ? formatFullDatePtBr(validityCardDate) : <span>Selecione uma data</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            locale={pt}
                                                            mode="single"
                                                            selected={validityCardDate}
                                                            onSelect={(date) => {
                                                                setValidityCardDate(date!);
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
                                    name="quotaStatus"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                <span>Estado da Cota*</span>
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
                                                        <SelectValue placeholder="Selecione a nacionalidade" />
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
                                        <FormItem>
                                            <FormLabel>
                                                <span>Data de validade</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] justify-start text-left font-normal",
                                                                !validityDocumentDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {validityDocumentDate ? formatFullDatePtBr(validityDocumentDate) : <span>Selecione uma data</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            locale={pt}
                                                            mode="single"
                                                            selected={validityDocumentDate}
                                                            onSelect={(date) => {
                                                                setValidityDocumentDate(date);
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
                                    {loading ? <Spinner size='small' /> : "Atualizar Associado"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default EditAssociate;
