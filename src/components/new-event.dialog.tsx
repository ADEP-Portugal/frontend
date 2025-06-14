"use client"

import { CirclePlus, ClockIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import React from "react";
import { Box } from "../components/ui/box";
import { Textarea } from "../components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "../services/event.service";
import { Event } from "../types/event";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { useMaskito } from '@maskito/react';
import { maskitoDateOptionsGenerator, maskitoTimeOptionsGenerator } from '@maskito/kit';
import { formatDateToISO } from "../util/date.util";

const FormSchema = z.object({
    name: z.string({ required_error: "Campo obrigatório" }),
    date: z.string({ required_error: "Campo obrigatório", }),
    time: z.string({ required_error: "Campo obrigatório", }).regex(/^\d{2}:\d{2}$/, { message: "Formato inválido. Exemplo: 12:00" }),
    location: z.string({ required_error: "Campo obrigatório", }),
    description: z.string({ required_error: "Campo obrigatório", }),
})

const NewEvent = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState<boolean>(false);
    const eventService = new EventService();
    const [loading, setLoading] = React.useState(false);
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
    });
    const mutation = useMutation({
        mutationFn: (createRequest: Event) => eventService.create(createRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            setLoading(false);
            setOpen(false);
            form.reset();
            toast.success("Evento criado com sucesso!");
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
        const eventData: Event = {
            name: data.name,
            date: formatDateToISO(data.date),
            time: data.time,
            location: data.location,
            description: data.description,
        };
        mutation.mutate(eventData);
    }

    const resetCreateEvent = () => {
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) resetCreateEvent();
            setOpen(open);
        }}>
            <DialogTrigger>
                <Button>
                    <CirclePlus />
                    Adicionar Evento
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Evento</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span>Título do Evento</span>
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
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span>Local</span>
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
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Spinner size='small' /> : "Salvar Evento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default NewEvent;
