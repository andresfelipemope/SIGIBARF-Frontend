"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowLeft, ShieldAlert } from "lucide-react";

import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";

import { authService } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  // Estados del flujo
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Campos de formulario
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errores
  const [errorGlobal, setErrorGlobal] = useState("");
  const [errorsByField, setErrorsByField] = useState({});

  // Indicador de fortaleza de contraseña
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Validar token en el primer montaje
  useEffect(() => {
    async function checkToken() {
      if (!uid || !token) {
        setErrorGlobal("Los parámetros del enlace son inválidos o están ausentes.");
        setIsTokenValid(false);
        setIsValidating(false);
        return;
      }

      try {
        await authService.validateResetToken(uid, token);
        setIsTokenValid(true);
      } catch (err) {
        setIsTokenValid(false);
        setErrorGlobal(err.message || "El token de recuperación es inválido o ha expirado.");
      } finally {
        setIsValidating(false);
      }
    }

    checkToken();
  }, [uid, token]);

  // Evaluar fortaleza de contraseña en tiempo real
  useEffect(() => {
    if (!newPassword) {
      setPasswordScore(0);
      setPasswordFeedback("");
      return;
    }

    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) score += 1;
    if (/\d/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    setPasswordScore(score);

    switch (score) {
      case 1:
        setPasswordFeedback("Muy débil - Mínimo 8 caracteres");
        break;
      case 2:
        setPasswordFeedback("Media - Agrega mayúsculas o números");
        break;
      case 3:
        setPasswordFeedback("Fuerte - Buen nivel de seguridad");
        break;
      case 4:
        setPasswordFeedback("Excelente - Contraseña altamente segura");
        break;
      default:
        setPasswordFeedback("Muy débil");
    }
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGlobal("");
    setErrorsByField({});

    // Validaciones del cliente
    const validationErrors = {};
    if (newPassword.length < 8) {
      validationErrors.new_password = "La contraseña debe tener al menos 8 caracteres.";
    }
    if (newPassword !== newPasswordConfirm) {
      validationErrors.new_password_confirm = "Las contraseñas no coinciden.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrorsByField(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.confirmPasswordReset(uid, token, newPassword, newPasswordConfirm);
      setIsSuccess(true);
      toast.success("Contraseña restablecida correctamente.");
    } catch (err) {
      if (err.data && typeof err.data === "object") {
        const fieldErrors = {};
        let globalMsg = "Por favor, corrige los errores señalados.";
        
        // Mapear los errores que devuelve Django a los campos
        if (err.data.new_password) {
          fieldErrors.new_password = Array.isArray(err.data.new_password) 
            ? err.data.new_password.join(" ") 
            : err.data.new_password;
        }
        if (err.data.new_password_confirm) {
          fieldErrors.new_password_confirm = Array.isArray(err.data.new_password_confirm) 
            ? err.data.new_password_confirm.join(" ") 
            : err.data.new_password_confirm;
        }
        if (err.data.detail) {
          globalMsg = err.data.detail;
        }

        setErrorsByField(fieldErrors);
        setErrorGlobal(globalMsg);
      } else {
        setErrorGlobal(err.message || "Ocurrió un error al intentar cambiar la contraseña.");
      }
      toast.error("Error al restablecer contraseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColorClass = () => {
    switch (passwordScore) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-emerald-600";
      default:
        return "bg-zinc-200";
    }
  };

  // 1. Estado de carga inicial (Validando Token)
  if (isValidating) {
    return (
      <Card className="border-zinc-200/60 shadow-xs bg-white">
        <CardHeader className="space-y-3 pb-6">
          <Skeleton className="h-6 w-2/3 bg-zinc-200/60" />
          <Skeleton className="h-4 w-5/6 bg-zinc-200/60" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/3 bg-zinc-200/60" />
            <Skeleton className="h-10 w-full bg-zinc-200/60" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/3 bg-zinc-200/60" />
            <Skeleton className="h-10 w-full bg-zinc-200/60" />
          </div>
          <Skeleton className="h-11 w-full bg-zinc-200/60" />
        </CardContent>
      </Card>
    );
  }

  // 2. Estado de éxito (Contraseña Cambiada)
  if (isSuccess) {
    return (
      <Card className="border-zinc-200/60 shadow-xs bg-white text-center">
        <CardHeader className="space-y-3 pt-8 pb-4 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-950">
            Contraseña restablecida
          </CardTitle>
          <CardDescription className="text-zinc-500 text-sm px-4">
            Tu contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión con tus nuevas credenciales.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-6 pt-2">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-xs flex items-center justify-center cursor-pointer">
              Iniciar Sesión
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // 3. Estado de Token Inválido o Expirado
  if (!isTokenValid) {
    return (
      <Card className="border-zinc-200/60 shadow-xs bg-white text-center">
        <CardHeader className="space-y-3 pt-8 pb-4 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-950">
            Enlace inválido o expirado
          </CardTitle>
          <CardDescription className="text-zinc-500 text-sm px-4 leading-normal">
            El enlace de recuperación que utilizaste ya no es válido, ha caducado o el usuario no existe. Los tokens de seguridad son de un solo uso.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6 pt-2">
          <Link href="/auth/forgot-password" className="w-full">
            <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-xs flex items-center justify-center cursor-pointer">
              Solicitar nuevo enlace
            </Button>
          </Link>
        </CardContent>

        <CardFooter className="pt-2 pb-6 border-t border-zinc-100 flex justify-center text-xs">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-800 font-semibold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // 4. Formulario de Restablecimiento (Token Válido)
  return (
    <Card className="border-zinc-200/60 shadow-xs bg-white">
      <CardHeader className="space-y-1.5 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-950">
            Nueva contraseña
          </CardTitle>
          <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
        </div>
        <CardDescription className="text-zinc-500 text-sm">
          Crea una nueva contraseña segura para tu cuenta.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {errorGlobal && (
          <Alert variant="destructive" className="border-red-200 bg-red-50/50 text-red-900 py-3 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertTitle className="text-xs font-semibold">Error</AlertTitle>
            <AlertDescription className="text-[11px] mt-0.5">{errorGlobal}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup className="gap-4">
            
            {/* Campo Nueva Contraseña */}
            <Field>
              <FieldLabel htmlFor="newPassword" className="text-xs font-semibold text-zinc-700">
                Nueva Contraseña
              </FieldLabel>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSubmitting}
                  className={`pl-9 pr-10 h-10 text-sm border-zinc-200/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 rounded-lg text-black bg-zinc-50/20 ${
                    errorsByField.new_password ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500/20 focus-visible:border-red-500" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Fortaleza de Contraseña */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex h-1.5 w-full gap-1 rounded-full bg-zinc-100 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getScoreColorClass()}`} style={{ width: `${(passwordScore / 4) * 100}%` }} />
                  </div>
                  <span className={`text-[10px] font-semibold transition-colors ${
                    passwordScore <= 1 ? "text-red-500" : passwordScore === 2 ? "text-orange-500" : passwordScore === 3 ? "text-yellow-600" : "text-emerald-600"
                  }`}>
                    {passwordFeedback}
                  </span>
                </div>
              )}

              {errorsByField.new_password && (
                <FieldError className="text-[10px] text-red-600 mt-1">{errorsByField.new_password}</FieldError>
              )}
            </Field>

            {/* Campo Confirmar Contraseña */}
            <Field>
              <FieldLabel htmlFor="newPasswordConfirm" className="text-xs font-semibold text-zinc-700">
                Confirmar Contraseña
              </FieldLabel>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <Input
                  id="newPasswordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu nueva contraseña"
                  autoComplete="new-password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  disabled={isSubmitting}
                  className={`pl-9 pr-10 h-10 text-sm border-zinc-200/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 rounded-lg text-black bg-zinc-50/20 ${
                    errorsByField.new_password_confirm ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500/20 focus-visible:border-red-500" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorsByField.new_password_confirm && (
                <FieldError className="text-[10px] text-red-600 mt-1">{errorsByField.new_password_confirm}</FieldError>
              )}
            </Field>

          </FieldGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando nueva contraseña...
              </>
            ) : (
              "Restablecer contraseña"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card className="border-zinc-200/60 shadow-xs bg-white">
          <CardHeader className="space-y-3 pb-6">
            <Skeleton className="h-6 w-2/3 bg-zinc-200/60 animate-pulse" />
            <Skeleton className="h-4 w-5/6 bg-zinc-200/60 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/3 bg-zinc-200/60 animate-pulse" />
              <Skeleton className="h-10 w-full bg-zinc-200/60 animate-pulse" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/3 bg-zinc-200/60 animate-pulse" />
              <Skeleton className="h-10 w-full bg-zinc-200/60 animate-pulse" />
            </div>
            <Skeleton className="h-11 w-full bg-zinc-200/60 animate-pulse" />
          </CardContent>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
