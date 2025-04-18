
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useForgotPassword } from '../hooks/auth';
import { useEffect } from 'react';
import { toast } from 'sonner';

const EmailSend = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const { mutate } = useForgotPassword(() => {
        navigate(`/email-send?email=${email}`);
    });

    useEffect(() => {
        if (!email) {
            navigate("/login", { replace: true });
        }
    }, [email, navigate]);

    const handleReSubmit = () => {
        if (email) {
            mutate(email);
        }
        toast.success("E-mail reenviado com sucesso!");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
                <div className="w-full max-w-md animate-fade-in-up">
                    <Card className="border-border/40 shadow-lg">
                        <CardHeader className="space-y-1">
                            <div className='bg-[#277494] rounded-full p-2 w-30 h-30 flex items-center justify-center mx-auto'>
                                <img className='align-self-center' src='email-send.png' width={70} height={70}></img>
                            </div>
                            <CardTitle className="text-xl font-bold text-center">
                                Verifique a sua caixa de entrada
                            </CardTitle>
                            <CardDescription className="text-center">
                                Já enviámos o link de recuperação. Por favor, verifique para continuar a recuperação da senha.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className='flex justify-center'>
                            <Button onClick={() => navigate("/login", { replace: true })} type="submit" className="w-full">
                                Beleza!
                            </Button>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <div className="text-center text-sm text-muted-foreground">
                                Não recebeu o e-mail?{" "}
                                <Button variant="link" onClick={handleReSubmit} className="p-0">
                                    Re-enviar
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EmailSend;
