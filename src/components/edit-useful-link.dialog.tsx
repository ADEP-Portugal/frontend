"use client"

import { CirclePlus, PenIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import React from "react";
import { Textarea } from "./ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LinkCategory } from "../types/link-category";
import { UsefulLink } from "../types/useful-link";
import { UsefulLinkService } from "../services/useful-link.service";

const FormSchema = z.object({
    title: z.string({ required_error: "Campo obrigatório" }),
    url: z.string({ required_error: "Campo obrigatório", }).url("URL inválida"),
    category: z.string({ required_error: "Campo obrigatório", }),
    description: z.string({ required_error: "Campo obrigatório", }),
})

const EditUsefulLink = ({ usefulLink }: { usefulLink: UsefulLink }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState<boolean>(false);
    const usefulLinkService = new UsefulLinkService();
    const [loading, setLoading] = React.useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: usefulLink.title,
            url: usefulLink.url,
            category: usefulLink.category,
            description: usefulLink.description,
        }
    });
    const mutation = useMutation({
        mutationFn: (createRequest: UsefulLink) => usefulLinkService.update(usefulLink.id!, createRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['links'] });
            setLoading(false);
            setOpen(false);
            toast.success("Link útil atualizado com sucesso!");
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
        const usefulLinkData: UsefulLink = {
            title: data.title,
            url: data.url,
            category: data.category,
            description: data.description,
        };
        mutation.mutate(usefulLinkData);
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
                <Button variant="outline">
                    <PenIcon />
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Link Útil</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span>Título do Link</span>
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
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span>URL</span>
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
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span>Categoria</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(value: string) => form.setValue("category", value)} {...field}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a nacionalidade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(LinkCategory).map(([key, value]) => (
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
                                {loading ? <Spinner size='small' /> : "Atualizar Link Útil"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditUsefulLink;
