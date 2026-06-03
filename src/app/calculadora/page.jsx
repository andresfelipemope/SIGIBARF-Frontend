'use client';

import { useState } from 'react';
import { Calculator, Dog, Activity, Info, Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BarfCalculator() {
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('adult');
  const [activity, setActivity] = useState('moderate');
  const [result, setResult] = useState(null);

  const calculatePortion = () => {
    if (!weight) return;

    const weightNum = parseFloat(weight);
    let percentage = 0.025;

    if (age === 'puppy') percentage = 0.05;
    else if (age === 'senior') percentage = 0.02;

    if (activity === 'low') percentage *= 0.9;
    else if (activity === 'high') percentage *= 1.1;

    const dailyPortion = weightNum * percentage * 1000;
    setResult(Math.round(dailyPortion));
  };

  const dailyMeals = result ? Math.round(result / 2) : null;

  // Clases Tailwind unificadas para los selectores nativos
  const selectClass = "w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition cursor-pointer appearance-none";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header consistente con el módulo */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
            <Calculator className="size-6" />
          </div>
          Calculadora BARF
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Calcula la porción diaria ideal según el peso, edad y nivel de actividad de tu mascota.
        </p>
      </div>

      <Card className="rounded-2xl border-gray-200 shadow-xs overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-5 gap-8">
            
            {/* ── Columna Izquierda: Formulario ── */}
            <div className="md:col-span-3 space-y-6">
              {/* Peso */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Scale className="size-4 text-gray-400" />
                  Peso de tu mascota (kg)
                </label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ej: 15"
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-orange-500/20 text-sm font-medium"
                />
              </div>

              {/* Edad (Select nativo) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Dog className="size-4 text-gray-400" />
                  Etapa de vida
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={selectClass}
                >
                  <option value="puppy">Cachorro (hasta 1 año)</option>
                  <option value="adult">Adulto (1 a 7 años)</option>
                  <option value="senior">Senior (más de 7 años)</option>
                </select>
              </div>

              {/* Actividad (Select nativo) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Activity className="size-4 text-gray-400" />
                  Nivel de actividad
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className={selectClass}
                >
                  <option value="low">Baja (sedentario / hogar)</option>
                  <option value="moderate">Moderada (paseos diarios)</option>
                  <option value="high">Alta (deporte / trabajo activo)</option>
                </select>
              </div>

              {/* Botón Principal */}
              <Button
                onClick={calculatePortion}
                className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-sm transition-all"
              >
                Calcular porción diaria
              </Button>
            </div>

            {/* ── Columna Derecha: Resultados ── */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Tarjeta de Resultado */}
              <div className={`rounded-xl border p-6 text-center space-y-3 transition-all duration-300 ${
                result 
                  ? 'bg-orange-50/50 border-orange-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Porción diaria recomendada
                </p>
                
                {result !== null ? (
                  <>
                    <div className="py-2">
                      <p className="text-5xl font-extrabold text-gray-900 tracking-tight">{result}g</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-white rounded-lg py-2 px-3 border border-gray-100">
                      <Scale className="size-4 text-orange-500" />
                      <span>≈ <strong>{dailyMeals}g</strong> por comida (2 veces al día)</span>
                    </div>
                  </>
                ) : (
                  <div className="py-4 flex flex-col items-center text-gray-400">
                    <Calculator className="size-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium">Ingresa los datos para calcular</p>
                  </div>
                )}
              </div>

              {/* Alerta Informativa */}
              <Alert className="rounded-xl border-amber-200 bg-amber-50/50 text-amber-900">
                <Info className="size-4 text-amber-600 shrink-0" />
                <div className="ml-2">
                  <AlertTitle className="text-sm font-bold text-amber-800">Nota importante</AlertTitle>
                  <AlertDescription className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Esta es una estimación general. Para un plan nutricional personalizado, 
                    contáctanos y nuestros expertos ajustarán la fórmula a las necesidades específicas de tu mascota.
                  </AlertDescription>
                </div>
              </Alert>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}