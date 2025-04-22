import { Header } from "../components/header";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { Spinner } from "../components/ui/spinner";
import { Button } from "../components/ui/button";
import PasswordStrengthBar from "react-password-strength-bar";
import { Box } from "../components/ui/box";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import { AuthService } from "../services/auth.service";

const FormSchema = z.object({
    fullName: z.string({ required_error: "Campo obrigatório" }),
    email: z.string({ required_error: "Campo obrigatório", }),
    password: z.string({ required_error: "Campo obrigatório", }),
    repeatPassword: z.string({ required_error: "Campo obrigatório", }),
})

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: user?.fullName,
            email: user?.email,
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await new AuthService().getUserWithToken();
    }

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="p-10 w-4/12">
                    <Form {...form}>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-5">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span>Nome Completo</span>
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
                                    <FormItem>
                                        <FormLabel>
                                            <span>Email</span>
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nova Senha</FormLabel>
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
                                        <PasswordStrengthBar shortScoreWord='Muito curta' scoreWords={['Fraca', 'Fraca', 'Mediana', 'Boa', 'Forte']} password={field.value} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="repeatPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Nova Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Spinner size='small' /> : "Atualizar"}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
