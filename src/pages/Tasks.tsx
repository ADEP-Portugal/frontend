"use client"

import { BriefcaseIcon, CalendarIcon, FileTextIcon, FlagIcon, Loader2Icon, PhoneIcon, StickyNoteIcon, Trash, UserIcon } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { getTaskBorderPriorityColor, getTaskIconPriorityColor, getTaskLabel, getTaskTextPriorityColor, TaskPriority } from "../types/task-priority";
import NewTask from "../components/new-task.dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "../services/task.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDateToPtBr } from "../util/date.util";
import { TaskStatus } from "../types/task-status";
import { LawsuitOrderType } from "../types/lawsuit-order-type";
import EditTask from "../components/edit-task.dialog";

const Tasks = () => {
    const queryClient = useQueryClient();
    const taskService = new TaskService();
    const [search, setSearch] = useState('');
    const [taskStatus, setTaskStatus] = useState<TaskStatus | undefined>(undefined);
    const [taskPriority, setTaskPriority] = useState<TaskPriority | undefined>(undefined);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['tasks', debouncedSearch, taskStatus, taskPriority],
        queryFn: () => taskService.filter(search, taskStatus, taskPriority),
    });
    const mutation = useMutation({
        mutationFn: (id: string | number) => taskService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success("Tarefa excluída com sucesso!");
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
                <Card className="p-10">
                    <div className="flex justify-between">
                        <NewTask />
                        <div className="flex gap-6 w-8/12">
                            <Input onChange={(e) => setSearch(e.target.value)} placeholder="Buscar tarefas..." />
                            <Select onValueChange={(value) => setTaskStatus(value as TaskStatus)}>
                                <SelectTrigger className="w-[310px]">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos os Status</SelectItem>
                                    <SelectItem value="TODO">A fazer</SelectItem>
                                    <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                                    <SelectItem value="DONE">Concluído</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => setTaskPriority(value as TaskPriority)}>
                                <SelectTrigger className="w-[360px]">
                                    <SelectValue placeholder="Selecione a prioridade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todas as Prioridades</SelectItem>
                                    <SelectItem value="LOW">Baixa</SelectItem>
                                    <SelectItem value="MEDIUM">Média</SelectItem>
                                    <SelectItem value="HIGH">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center col-span-4">
                                <Loader2Icon className="animate-spin" />
                            </div>)
                        }
                        {isError && (
                            <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                <StickyNoteIcon size={40} className="text-red-500" />
                                <span className="text-red-500">Erro ao carregar tarefas</span>
                                <span className="text-red-500">{error.message}</span>
                            </div>
                        )}
                        {data != null && data.data != null && data.data.length === 0 && (
                            <div className="text-3xl flex flex-col items-center justify-center col-span-4">
                                <StickyNoteIcon size={40} className="text-gray-500" />
                                <span className="text-gray-500">Nenhuma tarefa encontrada</span>
                            </div>
                        )}
                        {data != null && data.data.length > 0 && data.data.map((task, index) => (
                            <Card className={`${getTaskBorderPriorityColor(task.priority as TaskPriority)} w-[330px] mt-4`} key={index}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <p className="text-lg text-primary font-medium leading-none">
                                            {task.title}
                                        </p>
                                        <span className={`${getTaskTextPriorityColor(task.priority as TaskPriority)} text-sm font-medium flex`}>
                                            <FlagIcon className="w-5 mr-2" fill={getTaskIconPriorityColor(task.priority as TaskPriority)} />
                                            {getTaskLabel(task.priority as TaskPriority)}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <p className="flex gap-1">
                                        <UserIcon />{task.responsible}
                                    </p>
                                    <p className="flex gap-1">
                                        <FileTextIcon />{task.description}
                                    </p>
                                    <p className="flex gap-1">
                                        <CalendarIcon />{formatDateToPtBr(new Date(task.deadline))}
                                    </p>
                                    <p className="flex gap-1">
                                        <BriefcaseIcon />{task.responsible}
                                    </p>
                                    <p className="flex gap-1">
                                        <PhoneIcon />{task.phone}
                                    </p>
                                    <p>
                                        <span className="font-bold">Status:</span> {TaskStatus[task.status as keyof typeof TaskStatus]}
                                    </p>
                                    <div>
                                        <p className="font-bold mb-2">Processo Relacionado:</p>
                                        <span className="text-sm bg-primary p-1.5 text-white rounded-md font-medium">{task.lawsuitClient} - {LawsuitOrderType[task.lawsuitOrderType as keyof typeof LawsuitOrderType]}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <EditTask task={task} />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className="hover:bg-red-700" variant="destructive"><Trash />Excluir</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Essa tarefa será excluída permanentemente e não poderá ser desfeito.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => mutation.mutate(task.id!)}>Continuar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </Card>
            </div>
        </div>
    );
};

export default Tasks;
