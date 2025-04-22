"use client"

import { BriefcaseIcon, CalendarIcon, FileTextIcon, FlagIcon, Pen, PhoneIcon, Trash, UserIcon } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { TaskPriority } from "../types/task-priority";
import { TaskStatus } from "../types/task-status";
import { Separator } from "../components/ui/separator";
import NewTask from "../components/new-task.dialog";

const Tasks = () => {
    const taskList = [
        {
            priority: TaskPriority.LOW,
            status: TaskStatus.IN_PROGRESS,
            title: "Enviar documentos",
            responsible: "Leonardo Sarto",
            deadline: "17/04/2025",
            description: "Levar documentos",
            phone: "(44) 99999999",
            process: "teste - Registro Criminal",
        },
        {
            priority: TaskPriority.LOW,
            status: TaskStatus.IN_PROGRESS,
            title: "Enviar documentos",
            responsible: "Leonardo Sarto",
            deadline: "17/04/2025",
            description: "Levar documentos",
            phone: "(44) 99999999",
            process: "teste - Registro Criminal",
        },
        {
            priority: TaskPriority.MEDIUM,
            status: TaskStatus.TODO,
            title: "Enviar documentos",
            responsible: "Leonardo Sarto",
            deadline: "17/04/2025",
            description: "Levar documentos",
            phone: "(44) 99999999",
            process: "teste - Registro Criminal",
        },
        {
            priority: TaskPriority.HIGH,
            status: TaskStatus.DONE,
            title: "Enviar documentos",
            responsible: "Leonardo Sarto",
            deadline: "17/04/2025",
            description: "Levar documentos",
            phone: "(44) 99999999",
            process: "teste - Registro Criminal",
        },
        {
            priority: TaskPriority.HIGH,
            status: TaskStatus.DONE,
            title: "Enviar documentos",
            responsible: "Leonardo Sarto",
            deadline: "17/04/2025",
            description: "Levar documentos",
            phone: "(44) 99999999",
            process: "teste - Registro Criminal",
        },
    ];

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="p-10">
                    <div className="flex justify-between">
                        <NewTask />
                        <div className="flex gap-6 w-8/12">
                            <Input placeholder="Buscar tarefas..." />
                            <Select>
                                <SelectTrigger className="w-[310px]">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Status</SelectItem>
                                    <SelectItem value="today">A fazer</SelectItem>
                                    <SelectItem value="week">Em Progresso</SelectItem>
                                    <SelectItem value="month">Concluído</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-[360px]">
                                    <SelectValue placeholder="Selecione a prioridade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as Prioridades</SelectItem>
                                    <SelectItem value="today">Baixa</SelectItem>
                                    <SelectItem value="week">Média</SelectItem>
                                    <SelectItem value="month">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* <div className="grid grid-cols-3 gap-5">
                        {taskList.map((task, index) => <div className={`w-[330px] ${task.priority === TaskPriority.LOW ? 'border-lime-500' : task.priority === TaskPriority.MEDIUM ? 'border-yellow-400' : 'border-rose-500'}  bg-white rounded-xl border p-4 shadow-md`}>
                            <div className="flex justify-between items-center">
                                <p className="text-lg text-primary font-medium leading-none">
                                    {task.title}
                                </p>
                                {task.priority === TaskPriority.LOW && <span className="text-lime-500 text-sm font-medium flex">
                                    <FlagIcon className="w-5 mr-2" fill="#7CCF00" />
                                    Baixa
                                </span>}
                                {task.priority === TaskPriority.MEDIUM && <span className="text-yellow-400 text-sm font-medium flex">
                                    <FlagIcon className="w-5 mr-2" fill="#FDC700" />
                                    Média
                                </span>}
                                {task.priority === TaskPriority.HIGH && <span className="text-rose-500 text-sm font-medium flex">
                                    <FlagIcon className="w-5 mr-2" fill="#FF2056" />
                                    Alta
                                </span>}
                            </div>
                            <Separator className={`${task.priority === TaskPriority.LOW ? 'bg-lime-500' : task.priority === TaskPriority.MEDIUM ? 'bg-yellow-400' : 'bg-rose-500'} mt-2 mb-4`} />
                            <div className="flex flex-col gap-2">
                                <span className="flex gap-1">
                                    <UserIcon />{task.responsible}
                                </span>
                                <span className="flex gap-1">
                                    <FileTextIcon />{task.description}
                                </span>
                                <span className="flex gap-1">
                                    <CalendarIcon />{task.deadline}
                                </span>
                                <span className="flex gap-1">
                                    <BriefcaseIcon />{task.responsible}
                                </span>
                                <span className="flex gap-1">
                                    <PhoneIcon />{task.phone}
                                </span>
                                <div>
                                    <span className="font-bold">Status:</span> {task.status}
                                </div>
                                <div>
                                    <p className="font-bold mb-1">Processo Relacionado:</p>
                                    <span className="text-sm bg-primary p-1.5 text-white rounded-md font-medium">{task.process}</span>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4">
                                <Button variant="outline"><Pen />Editar</Button>
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
                                            <AlertDialogAction>Continuar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>)}
                    </div> */}
                    <div className="grid grid-cols-3 gap-5">
                        {taskList.map((task, index) => (
                            <Card className={`${task.priority === TaskPriority.LOW ? 'border-lime-500' : task.priority === TaskPriority.MEDIUM ? 'border-yellow-400' : 'border-rose-500'} w-[330px] mt-4`} key={index}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>Processo</span>
                                        {task.priority === TaskPriority.HIGH && <span className="text-red-500 flex">
                                            <FlagIcon />
                                            Alta
                                        </span>}
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
                                        <CalendarIcon />{task.deadline}
                                    </p>
                                    <p className="flex gap-1">
                                        <BriefcaseIcon />{task.responsible}
                                    </p>
                                    <p className="flex gap-1">
                                        <PhoneIcon />{task.phone}
                                    </p>
                                    <p>
                                        <span className="font-bold">Status:</span> {task.status}
                                    </p>
                                    <div>
                                        <p className="font-bold mb-2">Processo Relacionado:</p>
                                        <span className="text-sm bg-primary p-1.5 text-white rounded-md font-medium">{task.process}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline"><Pen />Editar</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className="hover:bg-red-700" variant="destructive"><Trash />Excluir</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esse processo será excluído permanentemente e não poderá ser desfeito.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction>Continuar</AlertDialogAction>
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
