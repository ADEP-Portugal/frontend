import { ChartBarIcon, FileTextIcon, HomeIcon, ListTodoIcon, LogOutIcon, MoveLeftIcon, UserIcon, UsersIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";

export function Header({ back }: { back?: boolean }) {
    const { user, logout } = useAuth();
    const navItems = [
        {
            title: "Inicial",
            url: "/",
            icon: HomeIcon,
        },
        {
            title: "Agenda",
            url: "/agenda",
            icon: ChartBarIcon,
        },
        {
            title: "Atendimentos",
            url: "/appointment",
            icon: UsersIcon,
        },
        {
            title: "Registros de Processos",
            url: "/proceeding",
            icon: FileTextIcon,
        },
        {
            title: "Painel de Tarefas",
            url: "#",
            icon: ListTodoIcon,
        },
        {
            title: "Relatório",
            url: "#",
            icon: ChartBarIcon,
        },
        {
            title: "Área Associados",
            url: "#",
            icon: UsersIcon,
        },
        {
            title: "Perfil",
            url: "/profile",
            icon: UserIcon,
        },
    ];

    return (
        <header className="flex bg-[#267393] text-white p-4 pb-6 rounded-b-3xl items-center justify-between">
            {back ?
                <Button size="icon" variant="ghost" onClick={() => window.history.back()}>
                    <MoveLeftIcon className="stroke-3" />
                </Button>
                : <div className="rounded-full bg-white w-12 h-12 flex items-center justify-center">
                    <img src='logo.png' width={350} height={350} />
                </div>}
            <h1 className="lg:text-4xl font-semibold">Assistente ADEP</h1>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="w-11 h-11">
                            <AvatarFallback>
                                <UserIcon color="black" />
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            <div>
                                {user?.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                                {user?.email}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Gerenciamento</DropdownMenuLabel>
                        {navItems.map((item) => (
                            <Link key={item.title} to={item.url}>
                                <DropdownMenuItem>
                                    <item.icon color="black" />
                                    {item.title}
                                </DropdownMenuItem>
                            </Link>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()}>
                            <LogOutIcon color="black" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
