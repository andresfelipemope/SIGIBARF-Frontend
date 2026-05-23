"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";

import { authService } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [correo, setCorreo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!correo) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.requestPasswordReset(correo);
      setIsSuccess(true);
      toast.success("Solicitud enviada. Revisa tu bandeja de entrada.");
    } catch (err) {
      setError(err.message || "No se pudo procesar tu solicitud de restablecimiento.");
      toast.error("Error al enviar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-zinc-200/60 shadow-xs bg-white text-center">
        <CardHeader className="space-y-3 pt-8 pb-4 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 animate-bounce">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-950">
            ¡Correo enviado!
          </CardTitle>
          <CardDescription className="text-zinc-500 text-sm max-w-xs">
            Si el correo <span className="font-semibold text-zinc-800 break-all">{correo}</span> está registrado en Athletic Barf, recibirás un enlace de restablecimiento en unos momentos.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-xs text-zinc-500 space-y-4 px-6 pb-6">
          <p className="leading-relaxed">
            Revisa tu bandeja de entrada (y la carpeta de spam o correo no deseado). 
            El enlace de recuperación es válido por tiempo limitado.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => setIsSuccess(false)}
              variant="outline"
              className="w-full text-zinc-700 border-zinc-200 hover:bg-zinc-50 font-medium h-10 rounded-lg cursor-pointer"
            >
              Intentar con otro correo
            </Button>
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6 border-t border-zinc-100 flex justify-center text-xs">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200/60 shadow-xs bg-white">
      <CardHeader className="space-y-1.5 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-950">
            Recuperar contraseña
          </CardTitle>
          <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
        </div>
        <CardDescription className="text-zinc-500 text-sm">
          Ingresa tu correo registrado y te enviaremos las instrucciones de restablecimiento.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50/50 text-red-900 py-3 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertTitle className="text-xs font-semibold">Error al enviar solicitud</AlertTitle>
            <AlertDescription className="text-[11px] mt-0.5">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleRequestReset} className="space-y-4">
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
          </FieldGroup>

          {/* Botón de Enviar */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando instrucciones...
              </>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex justify-center text-xs">
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
