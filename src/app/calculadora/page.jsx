"use client";

import { useState } from "react";
import {
  Calculator,
  Dog,
  Activity,
  Info,
  Scale,
  PawPrint,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BarfCalculator() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("adult");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState(null);

  const calculatePortion = () => {
    if (!weight) return;

    const weightNum = parseFloat(weight);

    let percentage = 0;

    if (age === "adult") {
      percentage = activity === "high" ? 0.05 : 0.03;
    }

    if (age === "puppy") {
      percentage = activity === "high" ? 0.1 : 0.07;
    }

    const dailyPortion = weightNum * 1000 * percentage;

    setResult(Math.round(dailyPortion));
  };

  const mealsPerDay = age === "puppy" ? 3 : 2;

  const portionPerMeal =
    result !== null ? Math.round(result / mealsPerDay) : null;

  // Clases Tailwind unificadas para los selectores nativos
  const selectClass =
    "w-full h-12 rounded-xl border-2 border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer appearance-none hover:border-gray-300";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Card completo con fondo negro */}
      <Card className="relative overflow-hidden rounded-3xl border-2 border-gray-800 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>

        {/* Icono de perro desvanecido como fondo decorativo */}
        <Dog
          className="absolute -right-8 -top-8 size-60 text-white/50 rotate-12"
          strokeWidth={1}
        />

        <CardContent className="relative z-10 p-8 md:p-10 mt-4">
          {/* Header dentro del Card */}
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50">
              <Calculator className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-green-500 tracking-tight">
                Calculadora BARF
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium mt-2">
                Calcula la cantidad diaria recomendada de dieta BARF para tu
                mascota.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-10">
            {/* ── Columna Izquierda: Formulario ── */}
            <div className="md:col-span-3 space-y-7">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PawPrint className="size-5 text-orange-500" />
                  Datos de tu mascota
                </h2>
                <p className="text-sm text-gray-400">
                  Ingresa la información para calcular la porción diaria
                </p>
              </div>

              {/* Peso */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-200">
                  <div className="p-1.5 rounded-lg bg-orange-500/20">
                    <Scale className="size-4 text-orange-400" />
                  </div>
                  Peso de tu mascota (kg)
                </label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ej: 15"
                  className="h-12 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-4 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 text-base font-semibold transition-all hover:border-gray-600"
                />
              </div>

              {/* Edad (Select nativo) */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-200">
                  <div className="p-1.5 rounded-lg bg-green-500/20">
                    <Dog className="size-4 text-green-400" />
                  </div>
                  Etapa de vida
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={selectClass}
                >
                  <option value="puppy">Cachorro</option>
                  <option value="adult">Adulto</option>
                </select>
              </div>

              {/* Actividad (Select nativo) */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-200">
                  <div className="p-1.5 rounded-lg bg-gray-700">
                    <Activity className="size-4 text-gray-300" />
                  </div>
                  Nivel de actividad
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className={selectClass}
                >
                  <option value="low">Baja actividad física</option>
                  <option value="high">Actividad física diaria</option>
                </select>
              </div>

              {/* Botón Principal */}
              <Button
                onClick={calculatePortion}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calculator className="size-5 mr-2" />
                Calcular porción diaria
              </Button>
            </div>

            {/* ── Columna Derecha: Resultados ── */}
            <div className="md:col-span-2 flex flex-col gap-5">
              {/* Tarjeta de Resultado */}
              <div
                className={`rounded-2xl border-2 p-7 text-center space-y-4 transition-all duration-300 ${
                  result
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg shadow-green-500/20"
                    : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp
                    className={`size-5 ${result ? "text-green-600" : "text-gray-400"}`}
                  />
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Porción diaria recomendada
                  </p>
                </div>

                {result !== null ? (
                  <>
                    <div className="py-3">
                      <p className="text-6xl font-black text-gray-900 tracking-tight">
                        {result}g
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700 bg-white rounded-xl py-3 px-4 border-2 border-green-200 shadow-sm">
                      <Scale className="size-5 text-green-600" />
                      <span className="font-semibold">
                        ≈{" "}
                        <strong className="text-green-700">
                          {portionPerMeal}g
                        </strong>{" "}
                        por comida ({mealsPerDay} veces al día)
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                      {age === "puppy"
                        ? "Los cachorros suelen requerir 3 comidas al día para apoyar su crecimiento."
                        : "Los perros adultos suelen dividir su ración diaria en 2 comidas."}
                    </p>
                  </>
                ) : (
                  <div className="py-6 flex flex-col items-center text-gray-400">
                    <Calculator className="size-10 mb-3 opacity-40" />
                    <p className="text-sm font-semibold">
                      Ingresa los datos para calcular
                    </p>
                  </div>
                )}
              </div>

              {/* Alerta Informativa */}
              <Alert className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 text-gray-900 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 shrink-0">
                    <Info className="size-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <AlertTitle className="text-sm font-bold text-gray-900 mb-1">
                      Nota importante
                    </AlertTitle>
                    <AlertDescription className="text-xs text-gray-700 leading-relaxed">
                      La recomendación se basa en la fórmula utilizada por
                      Athletic BARF: Adultos entre el 3% y 5% de su peso
                      corporal por día, y cachorros entre el 7% y 10%,
                      dependiendo de su nivel de actividad.
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
