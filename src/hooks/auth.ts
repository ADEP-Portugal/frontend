import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";
import { LoginPayload } from "../types/login";
import { SignupPayload } from "../types/signup";
import { ResetPasswordPayload } from "../types/reset-password";
import { AxiosError } from "axios";
import { User } from "../types/user";

const authService = new AuthService();

export function useLogin(onSuccess: (token: User) => void, onError: (error: AxiosError) => void) {
  return useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    mutationKey: ["login"],
    onError: (error: AxiosError) => {
      onError(error);
    },
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
}

export function useSignup(onSuccess: () => void) {
  return useMutation({
    mutationFn: (data: SignupPayload) => authService.signup(data),
    mutationKey: ["signup"],
    onError: (error) => {
      console.error("Erro ao fazer cadastro:", error);
    },
    onSuccess,
  });
}

export function useForgotPassword(onSuccess: () => void) {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    mutationKey: ["forgot-password"],
    onError: (error) => {
      console.error("Erro ao recuperar a senha:", error);
    },
    onSuccess
  });
}

export function useResetPassword(onSuccess: () => void) {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => authService.resetPassword(data),
    mutationKey: ["reset-password"],
    onError: (error) => {
      console.error("Erro ao resetar a senha:", error);
    },
    onSuccess
  });
}

export function useLogout(onSuccess: () => void) {
  return useMutation({
    mutationFn: () => authService.logout(),
    mutationKey: ["logout"],
    onError: (error) => {
      console.error("Erro ao sair da conta:", error);
    },
    onSuccess
  });
}