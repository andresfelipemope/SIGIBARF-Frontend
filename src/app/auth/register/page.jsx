"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Check } from "lucide-react";

import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";

import { authService } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de éxito y redirección
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Estados de error
  const [errorGlobal, setErrorGlobal] = useState("");
  const [errorsByField, setErrorsByField] = useState({});

  // Indicador de fortaleza de contraseña
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Efecto de cuenta regresiva para redirección al login
  useEffect(() => {
    if (!isSuccess) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/auth/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSuccess, router]);

  // Evaluar fortaleza de contraseña en tiempo real
  useEffect(() => {
    if (!password) {
      setPasswordScore(0);
      setPasswordFeedback("");
      return;
    }

    let score = 0;
    
    // Regla 1: Longitud
    if (password.length >= 8) score += 1;
    // Regla 2: Contiene mayúscula y minúscula
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    // Regla 3: Contiene número
    if (/\d/.test(password)) score += 1;
    // Regla 4: Contiene carácter especial o símbolo
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setPasswordScore(score);

    // Texto de feedback correspondiente
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
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorGlobal("");
    setErrorsByField({});

    // Validaciones del lado del cliente
    const validationErrors = {};
    if (!nombre) validationErrors.nombre = "El nombre es requerido.";
    if (!apellido) validationErrors.apellido = "El apellido es requerido.";
    if (!correo) validationErrors.correo = "El correo electrónico es requerido.";
    
    if (password.length < 8) {
      validationErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (password !== passwordConfirm) {
      validationErrors.password_confirm = "Las contraseñas no coinciden.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrorsByField(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Llamar al endpoint de registro
      const data = await authService.register({
        correo,
        password,
        password_confirm: passwordConfirm,
        nombre,
        apellido,
      });

      // Guardar el mensaje devuelto por la API
      setSuccessMsg(data.detail || "Cuenta creada correctamente. Inicia sesión con tu correo y contraseña.");
      setIsSuccess(true);
      toast.success("¡Cuenta creada con éxito!");
    } catch (err) {
      // El backend devuelve errores por campos (por ejemplo: { correo: ["Ya existe..."] }) o un string genérico en detail
      if (err.data && typeof err.data === "object") {
        const fieldErrors = {};
        let globalMsg = "Por favor, corrige los errores señalados.";
        
        // Mapear los errores que devuelve Django a los campos del formulario
        Object.keys(err.data).forEach((key) => {
          if (Array.isArray(err.data[key])) {
            fieldErrors[key] = err.data[key].join(" ");
          } else {
            fieldErrors[key] = err.data[key];
          }
        });
        
        if (err.data.non_field_errors) {
          globalMsg = Array.isArray(err.data.non_field_errors)
            ? err.data.non_field_errors.join(" ")
            : err.data.non_field_errors;
        }
        
        setErrorsByField(fieldErrors);
        setErrorGlobal(globalMsg);
      } else {
        setErrorGlobal(err.message || "Ha ocurrido un error inesperado. Inténtalo de nuevo.");
      }
      toast.error("Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar color del indicador de contraseña
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

  if (isSuccess) {
    return (
      <Card className="border-zinc-200/60 shadow-xs bg-white text-center">
        <CardHeader className="space-y-3 pt-8 pb-4 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 animate-bounce">
            <Check className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-950">
            ¡Cuenta Creada!
          </CardTitle>
          <CardDescription className="text-zinc-500 text-sm px-4 leading-normal">
            {successMsg}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 pt-2 space-y-4">
          <p className="text-xs text-zinc-400 font-medium">
            Redirigiéndote al inicio de sesión en <span className="font-bold text-orange-500 text-sm">{countdown}</span> segundos...
          </p>
          <Link href="/auth/login" className="block w-full">
            <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-xs flex items-center justify-center cursor-pointer">
              Iniciar Sesión Ahora
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200/60 shadow-xs bg-white">
      <CardHeader className="space-y-1.5 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-950">
            Crea tu cuenta
          </CardTitle>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <CardDescription className="text-zinc-500 text-sm">
          Únete a Athletic Barf para adquirir la mejor nutrición natural para tu mascota.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {errorGlobal && (
          <Alert variant="destructive" className="border-red-200 bg-red-50/50 text-red-900 py-3 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertTitle className="text-xs font-semibold">Error al registrarse</AlertTitle>
            <AlertDescription className="text-[11px] mt-0.5">{errorGlobal}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <FieldGroup className="gap-4">
            
            {/* Nombre y Apellido lado a lado */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="nombre" className="text-xs font-semibold text-zinc-700">
                  Nombre
                </FieldLabel>
                <div className="relative flex items-center">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Juan"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={isLoading}
                    className={`pl-9 h-10 text-sm border-zinc-200/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 rounded-lg text-black bg-zinc-50/20 ${
                      errorsByField.nombre ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500/20 focus-visible:border-red-500" : ""
                    }`}
                    required
                  />
                </div>
                {errorsByField.nombre && (
                  <FieldError className="text-[10px] text-red-600 mt-1">{errorsByField.nombre}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="apellido" className="text-xs font-semibold text-zinc-700">
                  Apellido
                </FieldLabel>
                <div className="relative flex items-center">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  <Input
                    id="apellido"
                    type="text"
                    placeholder="Pérez"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    disabled={isLoading}
                    className={`pl-9 h-10 text-sm border-zinc-200/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 rounded-lg text-black bg-zinc-50/20 ${
                      errorsByField.apellido ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500/20 focus-visible:border-red-500" : ""
                    }`}
                    required
                  />
                </div>
                {errorsByField.apellido && (
                  <FieldError className="text-[10px] text-red-600 mt-1">{errorsByField.apellido}</FieldError>
                )}
              </Field>
            </div>

            {/* Campo Correo */}
            <Field>
              <FieldLabel htmlFor="correo" className="text-xs font-semibold text-zinc-700">
                Correo Electrónico
              </FieldLabel>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <Input
                  id="correo"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={isLoading}
                  className={`pl-9 h-10 text-sm border-zinc-200/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 rounded-lg text-black bg-zinc-50/20 ${
                    errorsByField.correo ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500/20 focus-visible:border-red-500" : ""
                  }`}
                  required
                />
              </div>
              {errorsByField.correo && (
                <FieldError className="text-[10px] text-red-600 mt-1">{errorsByField.correo}</FieldError>
              )}
            </Field>

            {/* Campo Contraseña */}
            <Field>
              <FieldLabel htmlFor="password" className="text-xs font-semibold text-zinc-700">
                Contraseña
              </FieldLabel>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`pl-9 pr-10 h-10 text-sm border-zinc-200/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 rounded-lg text-black bg-zinc-50/20 ${
                    errorsByField.password ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500/20 focus-visible:border-red-500" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Barra indicadora de fortaleza en tiempo real */}
              {password && (
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

              {errorsByField.password && (
                <FieldError className="text-[10px] text-red-600 mt-1">{errorsByField.password}</FieldError>
              )}
            </Field>

            {/* Campo Confirmar Contraseña */}
            <Field>
              <FieldLabel htmlFor="passwordConfirm" className="text-xs font-semibold text-zinc-700">
                Confirmar Contraseña
              </FieldLabel>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <Input
                  id="passwordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  disabled={isLoading}
                  className={`pl-9 pr-10 h-10 text-sm border-zinc-200/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 rounded-lg text-black bg-zinc-50/20 ${
                    errorsByField.password_confirm ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500/20 focus-visible:border-red-500" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorsByField.password_confirm && (
                <FieldError className="text-[10px] text-red-600 mt-1">{errorsByField.password_confirm}</FieldError>
              )}
            </Field>

          </FieldGroup>

          {/* Botón de Registro */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creando tu cuenta...
              </>
            ) : (
              "Registrar Cuenta"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex justify-center text-xs">
        <p className="text-zinc-500 font-medium">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            Inicia sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
