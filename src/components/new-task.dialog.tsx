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
import { TaskPriority } from "../types/task-priority";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
]

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
    priority: z.string({ required_error: "Campo obrigatório", }),
    description: z.string({ required_error: "Campo obrigatório", }),
})

const NewTask = () => {
    const [birthday, setBirthday] = React.useState<Date>()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })
    const [comboboxOpen, setComboboxOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                form.reset()
                setBirthday(undefined)
            }
        }}>
            <DialogTrigger>
                <Button>
                    <CirclePlus />
                    Adicionar Tarefa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="responsible"
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
                            name="documentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span>Responsável</span>
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
                                                        ? frameworks.find((framework) => framework.value === value)?.label
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
                                                            {frameworks.map((framework) => (
                                                                <CommandItem
                                                                    key={framework.value}
                                                                    value={framework.value}
                                                                    onSelect={(currentValue) => {
                                                                        setValue(currentValue === value ? "" : currentValue)
                                                                        setComboboxOpen(false)
                                                                    }}
                                                                >
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            value === framework.value ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {framework.label}
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
                                name="responsible"
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
                                name="document"
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
                                name="birthday"
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
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Prioridade</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select form="priority" defaultValue="LOW" {...field}>
                                                <SelectTrigger className="w-[215px]">
                                                    <SelectValue placeholder="Selecione tipo de pedido" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(TaskPriority).map(([key, value]) => (
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
                        <FormField
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

export default NewTask;
