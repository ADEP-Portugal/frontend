import { ChartBarIcon, FileTextIcon, HomeIcon, LinkIcon, ListTodoIcon, LogOutIcon, MoonIcon, MoveLeftIcon, SunIcon, UserIcon, UsersIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTheme } from "./theme-provider";
import { useLogout } from "../hooks/auth";

export function Header({ back }: { back?: boolean }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { setTheme } = useTheme();
    const { mutate } = useLogout(() => {
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    });
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
            url: "/lawsuit",
            icon: FileTextIcon,
        },
        {
            title: "Painel de Tarefas",
            url: "/tasks",
            icon: ListTodoIcon,
        },
        {
            title: "Relatório",
            url: "/report",
            icon: ChartBarIcon,
        },
        {
            title: "Área Associados",
            url: "/associate",
            icon: UsersIcon,
        },
        {
            title: "Perfil",
            url: "/profile",
            icon: UserIcon,
        },
        {
            title: "Links Úteis",
            url: "/useful-links",
            icon: LinkIcon,
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
            <h1 className="lg:text-4xl font-semibold">Assistente ADIP</h1>
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <SunIcon color="black" className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Claro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Escuro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            Sistema
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="w-11 h-11">
                            <AvatarFallback>
                                <UserIcon />
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
                                    <item.icon />
                                    {item.title}
                                </DropdownMenuItem>
                            </Link>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => mutate()}>
                            <LogOutIcon />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
