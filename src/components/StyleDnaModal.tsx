import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  X,
  Palette,
  Shield,
  Sparkles,
  Briefcase,
  Heart,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface StyleDnaModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onRestartOnboarding: () => void;
}

export const StyleDnaModal: React.FC<StyleDnaModalProps> = ({
  isOpen,
  onClose,
  profile,
  onRestartOnboarding,
}) => {
  const [activeTab, setActiveTab] = useState<'color' | 'body' | 'style' | 'lifestyle' | 'comfort' | 'shopping'>('color');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FBF9F5] w-full sm:max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl border border-[#E8DEC9] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#C5A059] flex items-center justify-center font-serif text-sm">
              W
            </div>
            <div>
              <span className="font-serif text-base font-semibold text-stone-900 block leading-tight">
                Pasaporte Style DNA
              </span>
              <span className="text-[11px] text-stone-500">
                {profile.name} · {profile.colorDna.season} · {profile.styleDna.primary}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EBE3D5] bg-[#F4EFE6]/70 px-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'color', label: 'Color DNA', icon: Palette },
            { id: 'body', label: 'Body DNA', icon: Shield },
            { id: 'style', label: 'Style DNA', icon: Sparkles },
            { id: 'lifestyle', label: 'Lifestyle', icon: Briefcase },
            { id: 'comfort', label: 'Comfort', icon: Heart },
            { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-[#C86D51] text-[#A44C32] bg-white/60'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: COLOR DNA */}
          {activeTab === 'color' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-base font-bold text-stone-900">
                    {profile.colorDna.season}
                  </h4>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EFE8DC] text-stone-800">
                    {profile.colorDna.temperature} · Intensidad {profile.colorDna.intensity}
                  </span>
                </div>

                <div className="text-xs text-stone-600 mb-3">
                  Tu piel, ojos y cabello interactúan con la luz reflejando armonía cuando vistes tonos con base cálida y profundidad equilibrada.
                </div>

                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                    Paleta Estrella Recomendada
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.colorDna.palette.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-xl border border-stone-100 bg-[#FBF9F5]"
                      >
                        <div
                          className="w-6 h-6 rounded-lg shadow-2xs border border-black/10 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-stone-800 truncate block">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono block">
                            {c.hex}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                    Neutros de Inversión
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {profile.colorDna.neutrals.map((n, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-stone-200 bg-white text-xs font-medium text-stone-700"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: n.hex }}
                        />
                        <span>{n.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Metales Favorecedores
                  </span>
                  <div className="text-xs font-semibold text-[#B48C36]">
                    {profile.colorDna.metals.join(' · ')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-amber-950">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Colores a evitar cerca del rostro:</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                    {profile.colorDna.colorsToAvoid.map((avoid, idx) => (
                      <li key={idx}>{avoid}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BODY DNA */}
          {activeTab === 'body' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif text-base font-bold text-stone-900">
                    Silueta {profile.bodyDna.silhouette}
                  </h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFE8DC] font-medium text-stone-700">
                    Proporción equilibrada
                  </span>
                </div>

                <div className="text-xs text-stone-600 leading-relaxed">
                  El objetivo de Wilma no es encasillarte, sino armonizar la línea visual de hombros, cintura y caderas mediante cortes de ropa inteligentes.
                </div>

                <div className="border-t border-stone-100 pt-3 space-y-2.5">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Zonas a potenciar
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.bodyDna.featuresToHighlight.map((f, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-[#556B2F]/10 text-[#3F5122] text-xs font-medium"
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Escotes más favorecedores
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.bodyDna.recommendedNecklines.map((neck, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium"
                        >
                          {neck}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Largos ideales
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.bodyDna.recommendedLengths.map((len, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-[#EFE8DC] text-stone-800 text-xs font-medium"
                        >
                          {len}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STYLE DNA */}
          {activeTab === 'style' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {profile.styleDna.primary}
                  </h4>
                  <p className="text-xs italic text-[#C86D51] mt-0.5">
                    "{profile.styleDna.styleMotto}"
                  </p>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Distribución de Pilares
                  </span>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                      <span>Classic</span>
                      <span className="font-mono">{profile.styleDna.percentages.classic}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C86D51] h-2 rounded-full"
                        style={{ width: `${profile.styleDna.percentages.classic}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                      <span>Natural</span>
                      <span className="font-mono">{profile.styleDna.percentages.natural}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#556B2F] h-2 rounded-full"
                        style={{ width: `${profile.styleDna.percentages.natural}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                      <span>Creative</span>
                      <span className="font-mono">{profile.styleDna.percentages.creative}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C5A059] h-2 rounded-full"
                        style={{ width: `${profile.styleDna.percentages.creative}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                      <span>Romantic</span>
                      <span className="font-mono">{profile.styleDna.percentages.romantic}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#967BB6] h-2 rounded-full"
                        style={{ width: `${profile.styleDna.percentages.romantic}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-3">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                    Prendas Insignia
                  </span>
                  <ul className="text-xs text-stone-700 space-y-1">
                    {profile.styleDna.keyElements.map((el, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C86D51]" />
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIFESTYLE DNA */}
          {activeTab === 'lifestyle' && (
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-serif text-base font-bold text-stone-900">
                Rutina & Dinámica Real
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">PROFESIÓN</span>
                  <span className="font-semibold text-stone-800">{profile.lifestyleDna.profession}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">MODALIDAD</span>
                  <span className="font-semibold text-stone-800">{profile.lifestyleDna.workMode}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">RUTINA SEMANAL</span>
                  <span className="text-stone-700">{profile.lifestyleDna.routineDescription}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">CLIMA HABITUAL</span>
                  <span className="text-stone-700">{profile.lifestyleDna.climate}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COMFORT DNA */}
          {activeTab === 'comfort' && (
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-base font-bold text-stone-900">
                  Límites de Confort
                </h4>
                <span className="text-xs font-bold text-[#556B2F] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                  Prioridad: {profile.comfortDna.priorityScore}/10
                </span>
              </div>

              <div className="text-xs space-y-2 text-stone-700">
                <div>
                  <span className="text-stone-400 block text-[10px]">ALTURA MÁXIMA DE TACÓN</span>
                  <span className="font-semibold text-stone-900">{profile.comfortDna.maxHeelHeight}</span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px]">PRENDAS VETADAS</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.comfortDna.rejectedGarments.map((rej, i) => (
                      <span key={i} className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[11px]">
                        ✕ {rej}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px]">TEJIDOS PREFERIDOS</span>
                  <span className="font-medium text-stone-800">{profile.comfortDna.favoriteFabrics.join(', ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SHOPPING DNA */}
          {activeTab === 'shopping' && (
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-serif text-base font-bold text-stone-900">
                Estrategia de Compras
              </h4>
              <div className="text-xs space-y-2 text-stone-700">
                <div>
                  <span className="text-stone-400 block text-[10px]">NIVEL DE INVERSIÓN</span>
                  <span className="font-semibold text-stone-900">{profile.shoppingDna.budgetTier}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">FRECUENCIA</span>
                  <span className="text-stone-800">{profile.shoppingDna.shoppingFrequency}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">MARCAS DE REFERENCIA</span>
                  <span className="text-stone-800 font-medium">{profile.shoppingDna.favoriteBrands.join(' · ')}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">PRIORIDADES DE INVERSIÓN</span>
                  <span className="text-stone-800">{profile.shoppingDna.investmentPriorities.join(', ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#EBE3D5] bg-white flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onRestartOnboarding();
            }}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recalibrar Diagnóstico</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            Cerrar Pasaporte
          </button>
        </div>
      </div>
    </div>
  );
};
