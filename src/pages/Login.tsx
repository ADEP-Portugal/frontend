import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Spinner } from '../components/ui/spinner';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Box } from '../components/ui/box';
import { useLogin } from '../hooks/auth';
import { toast } from 'sonner';

const FormSchema = z.object({
    email: z.string({ required_error: "Campo obrigatório" }).email({ message: "Email inválido" }),
    password: z.string({ required_error: "Campo obrigatório", })
})

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { mutateAsync } = useLogin((response) => {
        localStorage.setItem("user", JSON.stringify(response));
        navigate("/", { replace: true });
    }, (error) => {
        if (error.status === 401) {
            toast.error("Credenciais inválidas");
        } else {
            toast.error("Erro ao realizar login");
        }
        setLoading(false);
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setLoading(true);
        await mutateAsync({ email: values.email, password: values.password });
    };

    useEffect(() => {
        if (localStorage.getItem("expiredSession") === "true") {
            toast.error("Sessão expirada. Faça login novamente.");
            localStorage.removeItem("expiredSession");
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <Card className="border-border/40 shadow-lg">
                        <CardHeader className="space-y-1">
                            <img className='align-self-center' src='logo.png' width={1000} height={1000}></img>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="nome@exemplo.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        <div className="flex items-center w-full justify-between">
                                                            <span>Senha</span>
                                                            <Link
                                                                to="/forgot-password"
                                                                className="text-sm text-primary hover:underline"
                                                            >
                                                                Esqueceu a senha?
                                                            </Link>
                                                        </div>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Box className="relative">
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="••••••••"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="link"
                                                                size="sm"
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-0"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                tabIndex={-1}
                                                            >
                                                                {showPassword ?
                                                                    <EyeOffIcon className="h-4 w-4" /> :
                                                                    <EyeIcon className="h-4 w-4" />
                                                                }
                                                            </Button>
                                                        </Box>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? <Spinner size='small' /> : "Acessar"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>

                        {/* <CardFooter className="flex flex-col space-y-4">
                            <div className="text-center text-sm text-muted-foreground">
                                Não possui uma conta?{" "}
                                <Link to="/signup" className="text-primary font-medium hover:underline">
                                    Cadastrar
                                </Link>
                            </div>
                        </CardFooter> */}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
