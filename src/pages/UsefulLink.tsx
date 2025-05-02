"use client"

import { FileIcon, LinkIcon, Loader2, StickyNote, Trash } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import NewUsefulLink from "../components/new-useful-link.dialog";
import { UsefulLinkService } from "../services/useful-link.service";
import EditUsefulLink from "../components/edit-useful-link.dialog";
import { Link } from "react-router-dom";

const UsefulLink = () => {
    const queryClient = useQueryClient();
    const usefulLinkService = new UsefulLinkService();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { isLoading, isError, data: usefulLinkList, error } = useQuery({
        queryKey: ['links', debouncedSearch],
        queryFn: () => usefulLinkService.filter(search),
    });
    const mutation = useMutation({
        mutationFn: (id: string | number) => usefulLinkService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['links'] });
            toast.success("Link útil excluído com sucesso!");
        }
    });

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="w-full">
                    <CardContent>
                        <div className="flex justify-between">
                            <NewUsefulLink />
                            <div className="flex gap-6 w-8/12">
                                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar links úteis..." />
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-4 gap-6">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center col-span-4">
                                    <Loader2 className="animate-spin" />
                                </div>)
                            }
                            {isError && (
                                <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                    <StickyNote size={40} className="text-red-500" />
                                    <span className="text-red-500">Erro ao carregar links úteis</span>
                                    <span className="text-red-500">{error.message}</span>
                                </div>
                            )}
                            {usefulLinkList != null && usefulLinkList.data != null && usefulLinkList.data.length === 0 && (
                                <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                    <StickyNote size={40} className="text-gray-500" />
                                    <span className="text-gray-500">Nenhum link útil encontrado</span>
                                </div>
                            )}
                            {usefulLinkList != null && usefulLinkList.data.length > 0 && usefulLinkList.data.map((usefulLink, index) => (
                                <Card className="w-[280px]" key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            {usefulLink.title.substring(0, 12)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2">
                                        <p className="flex gap-1">
                                            <LinkIcon />
                                            <Link to={usefulLink.url} target="_blank" className="line-clamp-1 text-primary">
                                                {usefulLink.url}
                                            </Link>
                                        </p>
                                        <p className="flex gap-1">
                                            <FileIcon />
                                            <span className="line-clamp-1">
                                                {usefulLink.description == null ? "" : usefulLink.description.substring(0, 26)}
                                            </span>
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <EditUsefulLink usefulLink={usefulLink} />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="hover:bg-red-700" variant="destructive"><Trash />Excluir</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esse evento será excluído permanentemente e não poderá ser desfeito.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => mutation.mutate(usefulLink.id!)}>Continuar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UsefulLink;
