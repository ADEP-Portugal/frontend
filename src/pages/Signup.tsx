import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Spinner } from '../components/ui/spinner';
import { useSignup } from '../hooks/auth';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import PasswordStrengthBar from 'react-password-strength-bar';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Box } from '../components/ui/box';

const FormSchema = z.object({
  email: z.string({ required_error: "Campo obrigatório" }).email({ message: "Email inválido" }),
  fullName: z.string({ required_error: "Campo obrigatório" }),
  password: z.string({ required_error: "Campo obrigatório" }),
  repeatPassword: z.string({ required_error: "Campo obrigatório" })
})

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate } = useSignup(() => {
    setLoading(false);
    toast.success("Conta criada com sucesso!");
    navigate("/login", { replace: true });
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    if (values.password !== values.repeatPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    setLoading(true);
    mutate({
      fullName: values.fullName, email: values.email, password: values.password
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="w-full max-w-md animate-fade-in-up">
          <Card className="border-border/40 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Criar uma conta
              </CardTitle>
              <CardDescription className="text-center">
                Introduza as suas informações para criar uma conta de cliente
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="nome@exemplo.com" {...field} />
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
                        <FormLabel>Senha</FormLabel>
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
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {loading ? <Spinner size='small' /> : 'Criar conta'}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Entrar
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Signup;
