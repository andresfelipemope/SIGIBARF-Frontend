'use client';

import { useState } from 'react';
import { Target, Eye } from 'lucide-react';
import Image from 'next/image';

export default function Nosotros() {
  const [activeTab, setActiveTab] = useState('mision');

  const tabs = {
    mision: {
      title: 'Misión',
      icon: Target,
      content: (
        <div key="mision" className="space-y-4 transition-all duration-300 ease-out">
          <p className="text-gray-600 leading-relaxed">
            Somos una empresa que ofrece <strong className="text-green-600">bienestar para la familia y su mascota</strong>, brindando una adecuada nutrición, ya que producimos y comercializamos alimento completamente natural, balanceado y seguro en el municipio de <strong className="text-green-600">Cúcuta</strong> y demás municipios de Norte de Santander.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Realizamos envíos a otras ciudades de nuestro país <strong className="text-green-600">Colombia</strong> y somos la única marca prestando el servicio en el país de <strong className="text-green-600">Venezuela</strong>.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Por consiguiente, nuestros productos responden a las necesidades nutricionales de las mascotas, prestando el servicio profesional adecuado para asesoría personalizada, generando <strong className="text-green-600">confianza, lealtad, responsabilidad y calidad</strong>.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Finalmente, nuestro objetivo social es ofrecer satisfacción y una excelente atención a nuestros clientes.
          </p>
        </div>
      ),
    },
    vision: {
      title: 'Visión',
      icon: Eye,
      content: (
        <div key="vision" className="space-y-4 transition-all duration-300 ease-out">
          <p className="text-gray-600 leading-relaxed">
            Para el año <strong className="text-green-600">2030</strong>, seremos la empresa de alimentación natural para mascotas preferida por todas las familias colombianas y venezolanas, propietarias de perros y gatos, brindando salud, bienestar, innovación y nutrición.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Seremos reconocidos por la <strong className="text-green-600">ética, calidad y servicio personalizado</strong> a nuestros clientes, todo a través del desarrollo del talento humano, proporcionando una permanente capacitación a nuestra fuerza laboral.
          </p>
          <p className="text-gray-600 leading-relaxed">
            De esta manera, buscamos contribuir al desarrollo de nuestro país y mejorar la <strong className="text-green-600">calidad de vida de las mascotas</strong>.
          </p>
        </div>
      ),
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#F5F1E8] to-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Imagen */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <Image
                src="/images/athleticbarfdog.jpg"
                alt="Alimento natural BARF para mascotas"
                width={800}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-600 rounded-full opacity-20 blur-3xl"></div>
          </div>

          {/* Contenido */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                ¿Quiénes somos?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                ATHLETIC BARF es una empresa colombiana, ubicada en la capital del departamento de Norte de Santander, dedicada a la fabricación y elaboración de alimentos 100% naturales, dieta BARF para mascotas.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Desde el año 2019, hemos venido desarrollando cada una de nuestras recetas, las cuales están pensadas en todas aquellas personas amantes de los compañeros de cuatro patas y quienes queremos siempre lo mejor para ellos.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Por tal motivo, proporcionamos una alternativa de nutrición con altos estándares de calidad, con todo el proceso adecuado, enfocándonos en brindar una mejor calidad de vida a cada una de sus mascotas.
              </p>
            </div>

            {/* Tabs */}
            <div className="pt-6">
              <div className="flex gap-3 mb-6">
                {Object.entries(tabs).map(([key, tab]) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === key;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                        font-semibold text-lg transition-all duration-300 transform
                        ${isActive 
                          ? 'bg-green-600 text-white shadow-lg scale-105' 
                          : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md border-2 border-gray-200'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-green-600'}`} />
                      {tab.title}
                    </button>
                  );
                })}
              </div>

              {/* Contenido dinámico */}
              <div
                key={activeTab}
                className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-green-600 min-h-[300px] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600/10 rounded-full flex items-center justify-center">
                    {activeTab === 'mision' ? (
                      <Target className="w-6 h-6 text-green-600" />
                    ) : (
                      <Eye className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {tabs[activeTab].title}
                  </h3>
                </div>

                {tabs[activeTab].content}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}