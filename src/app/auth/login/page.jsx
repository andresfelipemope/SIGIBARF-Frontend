"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";

import { authService } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [gsiLoaded, setGsiLoaded] = useState(false);

  // Intentar cargar credenciales recordadas e inicializar gsiLoaded si el script ya existe en window.google
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCorreo = localStorage.getItem("remembered_correo");
      if (savedCorreo) {
        setCorreo(savedCorreo);
        setRememberMe(true);
      }
      if (window.google) {
        setGsiLoaded(true);
      }
    }
  }, []);

  // Inicializar Google Identity Services de forma robusta con reintentos si el contenedor no está listo en el DOM
  useEffect(() => {
    let timer;

    const initializeGoogle = () => {
      if (typeof window !== "undefined" && window.google && gsiLoaded) {
        try {
          const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
          window.google.accounts.id.initialize({
            client_id: client_id,
            callback: handleGoogleCredentialResponse,
          });

          const container = document.getElementById("google-signin-btn");
          if (container) {
            window.google.accounts.id.renderButton(container, {
              theme: "outline",
              size: "large",
              width: "100%",
              text: "signin_with",
              shape: "rectangular",
            });
          } else {
            // El elemento DOM aún no está listo, programar reintento
            timer = setTimeout(initializeGoogle, 100);
          }
        } catch (err) {
          console.error("Error al inicializar Google Sign-In:", err);
        }
      }
    };

    // Ejecutar con un brevísimo retraso para dar tiempo al DOM a montarse
    timer = setTimeout(initializeGoogle, 50);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gsiLoaded]);

  const handleGoogleCredentialResponse = async (response) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await authService.googleLogin(response.credential);

      console.log("Respuesta backend:", data);
      
      // Guardar tokens y perfil en localStorage
      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`¡Bienvenido, ${data.user.nombre}! Sesión iniciada con Google.`);
      router.push("/home");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión con Google.");
      toast.error("Error de autenticación con Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!correo || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await authService.login(correo, password);

      console.log(data);

      // Manejo de Remember Me
      if (rememberMe) {
        localStorage.setItem("remembered_correo", correo);
      } else {
        localStorage.removeItem("remembered_correo");
      }

      // Guardar tokens y datos de usuario
      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`¡Hola de nuevo, ${data.user.nombre}!`);
      
      // Redirigir a Home
      router.push("/home");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas o problema de servidor.");
      toast.error("Inicio de sesión fallido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Carga dinámica del script oficial de Google GIS */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGsiLoaded(true)}
      />

      <Card className="border-zinc-200/60 shadow-xs bg-white">
        <CardHeader className="space-y-1.5 pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-950">
              ¡Hola de nuevo!
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          </div>
          <CardDescription className="text-zinc-500 text-sm">
            Ingresa tus credenciales para acceder a tu cuenta de Athletic Barf.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50/50 text-red-900 py-3 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertTitle className="text-xs font-semibold">Error al iniciar sesión</AlertTitle>
              <AlertDescription className="text-[11px] mt-0.5">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <FieldGroup className="gap-4">
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
                    className="pl-9 h-10 text-sm border-zinc-200/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 rounded-lg text-black bg-zinc-50/20"
                    required
                  />
                </div>
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
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-9 pr-10 h-10 text-sm border-zinc-200/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 rounded-lg text-black bg-zinc-50/20"
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
              </Field>
            </FieldGroup>

            {/* Opciones Adicionales */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-600 font-medium hover:text-zinc-900 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer accent-emerald-600"
                />
                Recordar mi correo
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-orange-600 hover:text-orange-500 font-semibold hover:underline underline-offset-4"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de Enviar */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          {/* Divisor */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-zinc-200/80" />
            <span className="flex-shrink mx-4 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
              O continuar con
            </span>
            <div className="flex-grow border-t border-zinc-200/80" />
          </div>

          {/* Botón de Google */}
          <div className="w-full flex justify-center">
            <div id="google-signin-btn" className="w-full min-h-[44px] flex items-center justify-center [&_iframe]:!rounded-lg" />
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6 flex justify-center text-xs">
          <p className="text-zinc-500 font-medium">
            ¿Aún no tienes cuenta?{" "}
            <Link
              href="/auth/register"
              className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline underline-offset-4"
            >
              Regístrate ahora
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
