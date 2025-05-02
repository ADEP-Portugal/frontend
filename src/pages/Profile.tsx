import { Header } from "../components/header";
import { Card, CardContent } from "../components/ui/card";
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
import { AuthService } from "../services/auth.service";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { User } from "../types/user";
import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/user.service";
import { toast } from "sonner";

const FormSchema = z.object({
    fullName: z.string({ required_error: "Campo obrigatório" }),
    email: z.string({ required_error: "Campo obrigatório", }),
    password: z.string().optional(),
})

const Profile = () => {
    const { user, getUserWithToken } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [birthdayNotifications, setBirthdayNotifications] = React.useState(localStorage.getItem("birthdayNotifications") == "true");
    const [expirationDocumentNotifications, setExpirationDocumentNotifications] = React.useState(localStorage.getItem("expirationDocumentNotifications") == "true");
    const [showPassword, setShowPassword] = useState(false);
    const userService = new UserService();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: user?.fullName,
            email: user?.email,
        },
    });
    const mutation = useMutation({
        mutationFn: (updateRequest: User) => userService.update(user != null ? user.id! : '', updateRequest),
        onSuccess: () => {
            setLoading(false);
            getUserWithToken();
            toast.success("Usuário atualizado com sucesso!");
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await form.trigger();
        if (!isValid) {
            return;
        }
        setLoading(true);
        const data = form.getValues();
        const userData: User = {
            fullName: data.fullName,
            email: data.email,
            passwordHash: data.password,
        };
        mutation.mutate(userData);
        await new AuthService().getUserWithToken();
    }

    const handleBirthdayNotification = (checked: boolean) => {
        setBirthdayNotifications(checked);
        localStorage.setItem("birthdayNotifications", `${checked}`);
    }

    const handleExpirationDocumentNotification = (checked: boolean) => {
        setExpirationDocumentNotifications(checked);
        localStorage.setItem("expirationDocumentNotifications", `${checked}`);
    }

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="w-4/12">
                    <CardContent>
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
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Spinner size='small' /> : "Atualizar"}
                                </Button>
                            </form>
                        </Form>
                        <div className="flex items-center space-x-2">
                            <Switch checked={birthdayNotifications} onCheckedChange={handleBirthdayNotification} id="birthday-notifications" />
                            <Label htmlFor="birthday-notifications">Receber notificações de aniversariantes</Label>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                            <Switch checked={expirationDocumentNotifications} onCheckedChange={handleExpirationDocumentNotification} id="expiration-document-notifications" />
                            <Label htmlFor="expiration-document-notifications">Receber notificações de documentos a expirar</Label>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
