
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { useForgotPassword } from '../hooks/auth';
import { Spinner } from '../components/ui/spinner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { mutate } = useForgotPassword(() => {
        setLoading(false);
        navigate(`/email-send?email=${email}`);
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        mutate(email);
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
                <div className="w-full max-w-md animate-fade-in-up">
                    <Card className="border-border/40 shadow-lg">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">
                                Recuperar senha
                            </CardTitle>
                            <CardDescription className="text-center">
                                Informe seu e-mail para recuperar sua senha
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nome@exemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    {loading ? <Spinner size='small' /> : "Enviar"}
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <div className="text-center text-sm text-muted-foreground">
                                Lembrou a senha?{" "}
                                <Link to="/email-send" className="text-primary font-medium hover:underline">
                                    Entrar
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
