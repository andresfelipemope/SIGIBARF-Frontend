"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  User, Mail, Phone, MapPin, Shield, Calendar, Edit2, KeyRound, 
  Loader2, AlertCircle, CheckCircle, Eye, EyeOff, Lock, Heart, Award
} from "lucide-react";

import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose 
} from "@/components/ui/dialog";

import { authService } from "@/lib/api";

export default function UserProfilePage() {
  const router = useRouter();
  
  // Perfil del Usuario
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Diálogos
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Campos para Edición de Perfil
  const [editNombre, setEditNombre] = useState("");
  const [editApellido, setEditApellido] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editDireccion, setEditDireccion] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  // Campos para Cambio de Contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Fetch Perfil al cargar
  useEffect(() => {
    async function fetchUserProfile() {
      const token = localStorage.getItem("access");
      if (!token) {
        toast.error("Por favor, inicia sesión para acceder a tu perfil.");
        router.push("/auth/login");
        return;
      }

      try {
        const data = await authService.getProfile();
        setProfile(data);
        
        // Inicializar campos de edición
        setEditNombre(data.nombre || "");
        setEditApellido(data.apellido || "");
        setEditTelefono(data.telefono || "");
        setEditDireccion(data.direccion || "");
      } catch (err) {
        console.error("Error al obtener perfil:", err);
        // Si el token expiró o es inválido, forzar logout
        if (err.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
          toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          router.push("/auth/login");
        } else {
          toast.error("No se pudo cargar la información del perfil.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [router]);

  // Fortaleza de contraseña en tiempo real
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

  // Handler de Edición de Perfil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditError("");
    setIsUpdating(true);

    if (!editNombre.trim() || !editApellido.trim()) {
      setEditError("Nombre y apellido son campos requeridos.");
      setIsUpdating(false);
      return;
    }

    try {
      const updatedData = await authService.updateProfile({
        nombre: editNombre,
        apellido: editApellido,
        telefono: editTelefono,
        direccion: editDireccion,
      });

      setProfile(updatedData);
      localStorage.setItem("user", JSON.stringify(updatedData));
      toast.success("¡Perfil actualizado correctamente!");
      setIsEditOpen(false);
    } catch (err) {
      setEditError(err.message || "Error al actualizar el perfil.");
      toast.error("No se pudo actualizar el perfil");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler de Cambio de Contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setIsChanging(true);

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setPasswordError("Por favor, completa todos los campos de contraseña.");
      setIsChanging(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.");
      setIsChanging(false);
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setPasswordError("La confirmación de la nueva contraseña no coincide.");
      setIsChanging(false);
      return;
    }

    try {
      await authService.changePassword(currentPassword, newPassword, newPasswordConfirm);
      toast.success("¡Tu contraseña ha sido cambiada con éxito!");
      
      // Limpiar campos
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setIsPasswordOpen(false);
    } catch (err) {
      setPasswordError(err.message || "Error al actualizar la contraseña. Revisa tus datos.");
      toast.error("No se pudo cambiar la contraseña");
    } finally {
      setIsChanging(false);
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

  // 1. Estado de Carga (Skeletons)
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 bg-[#fafaf9] min-h-screen">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64 bg-zinc-200" />
          <Skeleton className="h-4 w-96 bg-zinc-200" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 col-span-1">
            <Card className="border-zinc-200/60 bg-white">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <Skeleton className="size-24 rounded-full bg-zinc-200" />
                <Skeleton className="h-6 w-40 bg-zinc-200" />
                <Skeleton className="h-4 w-28 bg-zinc-200" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="border-zinc-200/60 bg-white">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-zinc-200" />
                <Skeleton className="h-4 w-80 bg-zinc-200" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full bg-zinc-200" />
                <Skeleton className="h-10 w-full bg-zinc-200" />
                <Skeleton className="h-10 w-full bg-zinc-200" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8 bg-[#fafaf9] min-h-screen z-10 relative">
      
      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Mi Cuenta
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gestiona tu información personal, datos de contacto y seguridad de acceso.
          </p>
        </div>
        
        {/* Badge de completitud */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start md:self-auto border ${
          profile.is_perfil_completo 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700" 
            : "bg-orange-500/10 border-orange-500/20 text-orange-700"
        }`}>
          {profile.is_perfil_completo ? (
            <>
              <CheckCircle className="size-3.5" />
              Perfil Completado
            </>
          ) : (
            <>
              <AlertCircle className="size-3.5" />
              Perfil Incompleto
            </>
          )}
        </div>
      </div>

      {/* Alerta de Onboarding si el perfil no está completo */}
      {!profile.is_perfil_completo && (
        <Alert className="border-orange-500/20 bg-orange-50/50 text-orange-900 rounded-2xl flex gap-3 p-4 items-start shadow-xs">
          <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <AlertTitle className="text-sm font-bold tracking-tight">¡Completa tu información de perfil!</AlertTitle>
            <AlertDescription className="text-xs text-orange-800/90 mt-1 leading-relaxed">
              Actualmente no has agregado tu número de **teléfono** o **dirección**. Completa estos datos para agilizar el proceso de compra y garantizar envíos de Barf precisos y seguros a tu hogar.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Grid del Perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Columna Izquierda: Tarjeta de Avatar y Rol */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-zinc-200/60 bg-white overflow-hidden rounded-2xl shadow-xs">
            {/* Portada Decorativa con gradiente sutil de marca */}
            <div className="h-24 w-full bg-linear-to-r from-green-700 via-emerald-600 to-orange-500 relative" />
            
            <CardContent className="pt-0 flex flex-col items-center text-center px-6 pb-6 relative z-10 -mt-12">
              <div className="size-24 rounded-full border-4 border-white bg-emerald-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-md mb-4 uppercase">
                {profile.nombre ? profile.nombre[0] : <User className="size-10" />}
              </div>
              
              <h2 className="text-xl font-bold text-zinc-950">
                {profile.nombre} {profile.apellido}
              </h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5 break-all">
                {profile.correo}
              </p>

              {/* Badge de Rol */}
              <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold uppercase tracking-wider">
                <Shield className="size-3.5 text-zinc-500" />
                Rol: {profile.rol}
              </div>
            </CardContent>
            
            {/* Footer de Tarjeta decorado con fecha */}
            <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 px-6 flex items-center gap-2 text-xs text-zinc-500 font-medium justify-center">
              <Calendar className="size-4 text-emerald-600 shrink-0" />
              <span>Registrado el: </span>
              <span className="font-semibold text-zinc-700">
                {new Date(profile.created_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Tarjeta de Datos y Acciones */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200/60 bg-white rounded-2xl shadow-xs">
            <CardHeader className="border-b border-zinc-100 pb-5">
              <CardTitle className="text-lg font-bold text-zinc-950">
                Información de contacto
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs">
                Datos necesarios para la facturación, llamadas y entrega de paquetes de Athletic Barf.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Teléfono */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-zinc-100 bg-zinc-50/20">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                    <Phone className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Teléfono de contacto</span>
                    <span className="text-sm font-semibold text-zinc-800">
                      {profile.telefono ? profile.telefono : <span className="text-orange-500 font-medium text-xs">No registrado</span>}
                    </span>
                  </div>
                </div>

                {/* Dirección */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-zinc-100 bg-zinc-50/20">
                  <div className="p-2 rounded-lg bg-orange-50 text-orange-600 shrink-0">
                    <MapPin className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Dirección de entrega</span>
                    <span className="text-sm font-semibold text-zinc-800 leading-snug break-words">
                      {profile.direccion ? profile.direccion : <span className="text-orange-500 font-medium text-xs">No registrada</span>}
                    </span>
                  </div>
                </div>

              </div>

              {/* Divisor */}
              <div className="border-t border-zinc-100 pt-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
                
                {/* Botón Editar Perfil */}
                <Button
                  onClick={() => setIsEditOpen(true)}
                  className="w-full sm:w-auto h-11 px-5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit2 className="size-4 text-emerald-600" />
                  Editar Datos
                </Button>

                {/* Botón Cambiar Contraseña */}
                <Button
                  onClick={() => setIsPasswordOpen(true)}
                  className="w-full sm:w-auto h-11 px-5 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="size-4 text-orange-400" />
                  Cambiar Contraseña
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* DIÁLOGO: EDITAR DATOS */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-extrabold text-zinc-950 flex items-center gap-2">
              <User className="size-5 text-emerald-600" />
              Editar perfil
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-1">
              Actualiza tu información personal y datos de contacto en Athletic Barf.
            </DialogDescription>
          </DialogHeader>

          {editError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50/50 text-red-950 py-3 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <AlertDescription className="text-xs">{editError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <FieldGroup className="gap-4">
              
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="editNombre" className="text-xs font-semibold text-zinc-700">Nombre</FieldLabel>
                  <Input
                    id="editNombre"
                    type="text"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    disabled={isUpdating}
                    className="h-10 border-zinc-200/80 rounded-lg text-black bg-zinc-50/20 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="editApellido" className="text-xs font-semibold text-zinc-700">Apellido</FieldLabel>
                  <Input
                    id="editApellido"
                    type="text"
                    value={editApellido}
                    onChange={(e) => setEditApellido(e.target.value)}
                    disabled={isUpdating}
                    className="h-10 border-zinc-200/80 rounded-lg text-black bg-zinc-50/20 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                    required
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="editTelefono" className="text-xs font-semibold text-zinc-700">Teléfono</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="editTelefono"
                    type="tel"
                    placeholder="3001234567"
                    value={editTelefono}
                    onChange={(e) => setEditTelefono(e.target.value)}
                    disabled={isUpdating}
                    className="pl-9 h-10 border-zinc-200/80 rounded-lg text-black bg-zinc-50/20 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="editDireccion" className="text-xs font-semibold text-zinc-700">Dirección</FieldLabel>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="editDireccion"
                    type="text"
                    placeholder="Calle 10 # 20 - 30"
                    value={editDireccion}
                    onChange={(e) => setEditDireccion(e.target.value)}
                    disabled={isUpdating}
                    className="pl-9 h-10 border-zinc-200/80 rounded-lg text-black bg-zinc-50/20 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                  />
                </div>
              </Field>

            </FieldGroup>

            <DialogFooter className="mt-6 border-t border-zinc-100 pt-4 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isUpdating} className="h-10 rounded-xl cursor-pointer">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isUpdating} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer">
                {isUpdating ? <Loader2 className="size-4 animate-spin" /> : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: CAMBIAR CONTRASEÑA */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-extrabold text-zinc-950 flex items-center gap-2">
              <Lock className="size-5 text-orange-500" />
              Cambiar contraseña
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-1">
              Actualiza la clave de acceso de tu cuenta.
            </DialogDescription>
          </DialogHeader>

          {passwordError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50/50 text-red-950 py-3 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <AlertDescription className="text-xs">{passwordError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <FieldGroup className="gap-4">
              
              {/* Contraseña Actual */}
              <Field>
                <FieldLabel htmlFor="currentPassword" className="text-xs font-semibold text-zinc-700">Contraseña Actual</FieldLabel>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChanging}
                    className="pl-9 pr-10 h-10 border-zinc-200/80 rounded-lg text-black bg-zinc-50/20 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              {/* Nueva Contraseña */}
              <Field>
                <FieldLabel htmlFor="newPassword" className="text-xs font-semibold text-zinc-700">Nueva Contraseña</FieldLabel>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChanging}
                    className="pl-9 pr-10 h-10 border-zinc-200/80 rounded-lg text-black bg-zinc-50/20 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                
                {/* Fortaleza de contraseña */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex h-1.5 w-full gap-1 rounded-full bg-zinc-100 overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${getScoreColorClass()}`} style={{ width: `${(passwordScore / 4) * 100}%` }} />
                    </div>
                    <span className={`text-[10px] font-semibold ${
                      passwordScore <= 1 ? "text-red-500" : passwordScore === 2 ? "text-orange-500" : passwordScore === 3 ? "text-yellow-600" : "text-emerald-600"
                    }`}>
                      {passwordFeedback}
                    </span>
                  </div>
                )}
              </Field>

              {/* Confirmar Nueva Contraseña */}
              <Field>
                <FieldLabel htmlFor="newPasswordConfirm" className="text-xs font-semibold text-zinc-700">Confirmar Nueva Contraseña</FieldLabel>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="newPasswordConfirm"
                    type={showConfirm ? "text" : "password"}
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    disabled={isChanging}
                    className="pl-9 pr-10 h-10 border-zinc-200/80 rounded-lg text-black bg-zinc-50/20 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

            </FieldGroup>

            <DialogFooter className="mt-6 border-t border-zinc-100 pt-4 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isChanging} className="h-10 rounded-xl cursor-pointer">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isChanging} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer">
                {isChanging ? <Loader2 className="size-4 animate-spin" /> : "Cambiar Contraseña"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}