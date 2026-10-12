import React, { useState } from 'react';
import { UserProfile, ColorSeason, BodySilhouette } from '../types';
import { COLOR_PALETTES } from '../data/defaultStyleDna';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Dna,
  Heart,
  Palette,
  User,
  Shield,
  Layers,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => void;
  currentProfile: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  currentProfile,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState(currentProfile.name || 'Victoria');
  const [profession, setProfession] = useState(currentProfile.lifestyleDna.profession || 'Consultora / Directiva');
  const [workMode, setWorkMode] = useState(currentProfile.lifestyleDna.workMode || 'Híbrido');
  const [climate, setClimate] = useState(currentProfile.lifestyleDna.climate || 'Mediterráneo templado');

  // Style distribution
  const [classic, setClassic] = useState(currentProfile.styleDna.percentages.classic || 40);
  const [natural, setNatural] = useState(currentProfile.styleDna.percentages.natural || 30);
  const [creative, setCreative] = useState(currentProfile.styleDna.percentages.creative || 20);
  const [romantic, setRomantic] = useState(currentProfile.styleDna.percentages.romantic || 10);

  // Color questions
  const [undertone, setUndertone] = useState<'calido' | 'frio' | 'neutro'>('calido');
  const [selectedSeason, setSelectedSeason] = useState<ColorSeason>(currentProfile.colorDna.season || 'Otoño Cálido');

  // Body questions
  const [silhouette, setSilhouette] = useState<BodySilhouette>(currentProfile.bodyDna.silhouette || 'Reloj de Arena');
  const [maxHeel, setMaxHeel] = useState(currentProfile.comfortDna.maxHeelHeight || '4 a 6 cm (tacón medio)');
  const [comfortPriority, setComfortPriority] = useState(currentProfile.comfortDna.priorityScore || 9);
  const [rejectedItems, setRejectedItems] = useState<string>(
    currentProfile.comfortDna.rejectedGarments.join(', ') || 'Tiro bajo, tacones de aguja finos'
  );

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    // Generate calculated Style DNA
    const paletteData = COLOR_PALETTES[selectedSeason] || COLOR_PALETTES['Otoño Cálido'];

    // Determine style archetype name
    let primaryArchetype = 'Classic Chic Sofisticado';
    if (creative >= 35) primaryArchetype = 'Creative Minimalist Vanguardista';
    else if (natural >= 35) primaryArchetype = 'Natural Chic Elegante';
    else if (romantic >= 35) primaryArchetype = 'Romantic Femenino Moderno';
    else if (classic >= 40 && creative >= 20) primaryArchetype = 'Classic con Acento Creativo';

    const updatedProfile: UserProfile = {
      ...currentProfile,
      name,
      isOnboarded: true,
      colorDna: {
        season: selectedSeason,
        temperature: paletteData.temperature,
        depth: paletteData.depth,
        intensity: paletteData.intensity,
        contrast: paletteData.contrast,
        palette: paletteData.palette,
        neutrals: paletteData.neutrals,
        metals: paletteData.metals,
        colorsToAvoid: paletteData.avoid,
      },
      bodyDna: {
        ...currentProfile.bodyDna,
        silhouette,
      },
      styleDna: {
        primary: primaryArchetype,
        percentages: { classic, natural, creative, romantic },
        keyElements: [
          'Prendas de corte limpio y sastre contemporáneo',
          'Tejidos nobles con caída natural',
          'Accesorios con personalidad en metales acordes',
        ],
        styleMotto: 'Prendas con intención que transmiten calma, autoridad y belleza propia.',
      },
      lifestyleDna: {
        ...currentProfile.lifestyleDna,
        profession,
        workMode: workMode as any,
        climate,
      },
      comfortDna: {
        ...currentProfile.comfortDna,
        priorityScore: comfortPriority,
        maxHeelHeight: maxHeel,
        rejectedGarments: rejectedItems
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      },
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FBF9F5] w-full sm:max-w-md h-[92vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl border border-[#E8DEC9] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBE3D5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1C1917] text-[#C5A059] flex items-center justify-center font-serif text-sm">
              W
            </div>
            <div>
              <span className="font-serif text-base font-semibold text-stone-900 block leading-tight">
                Diagnóstico Style DNA
              </span>
              <span className="text-[10px] text-stone-500">
                Paso {step} de 5 · {step === 1 && 'Sobre Ti'}
                {step === 2 && 'Tu Estilo'}
                {step === 3 && 'Tus Colores'}
                {step === 4 && 'Tu Cuerpo & Confort'}
                {step === 5 && 'Tu Pasaporte'}
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

        {/* Progress Bar */}
        <div className="w-full bg-[#EFE8DC] h-1.5">
          <div
            className="bg-[#C86D51] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* STEP 1: About You */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <span className="w-10 h-10 rounded-2xl bg-[#EFE8DC] text-[#C86D51] inline-flex items-center justify-center mb-2">
                  <User className="w-5 h-5" />
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Cuéntame sobre ti
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Para diseñar soluciones reales, necesito conocer tu día a día, no una versión idealizada.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  ¿Cómo te llamas?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Tu profesión o actividad principal
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Ej. Directiva, Diseñadora, Abogada, Emprendedora..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Modalidad de trabajo habitual
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Presencial', 'Híbrido', '100% Remoto', 'Itinerante / Viajes'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setWorkMode(mode as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        workMode === mode
                          ? 'border-[#C86D51] bg-[#C86D51]/10 text-[#A44C32] font-semibold'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Clima donde vives la mayor parte del año
                </label>
                <input
                  type="text"
                  value={climate}
                  onChange={(e) => setClimate(e.target.value)}
                  placeholder="Ej. Templado mediterráneo, Frío continental..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Your Style */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <span className="w-10 h-10 rounded-2xl bg-[#EFE8DC] text-[#C5A059] inline-flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Tus 4 Pilares de Estilo
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Nadie tiene un estilo único. Ajusta cómo resuena cada arquetipo en ti:
                </p>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
                {/* Classic */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                    <span>Classic (Atemporal, sastrería, orden)</span>
                    <span className="text-[#C86D51] font-mono">{classic}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={classic}
                    onChange={(e) => setClassic(Number(e.target.value))}
                    className="w-full accent-[#C86D51]"
                  />
                </div>

                {/* Natural */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                    <span>Natural (Comodidad, tejidos puros, libertad)</span>
                    <span className="text-[#556B2F] font-mono">{natural}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={natural}
                    onChange={(e) => setNatural(Number(e.target.value))}
                    className="w-full accent-[#556B2F]"
                  />
                </div>

                {/* Creative */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                    <span>Creative (Detalles únicos, contraste, diseño)</span>
                    <span className="text-[#C5A059] font-mono">{creative}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={creative}
                    onChange={(e) => setCreative(Number(e.target.value))}
                    className="w-full accent-[#C5A059]"
                  />
                </div>

                {/* Romantic */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                    <span>Romantic (Fluidez, feminidad suave, detalles)</span>
                    <span className="text-[#967BB6] font-mono">{romantic}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={romantic}
                    onChange={(e) => setRomantic(Number(e.target.value))}
                    className="w-full accent-[#967BB6]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F4EFE6] rounded-xl text-xs text-stone-700 leading-relaxed border border-[#E5DAC6]">
                💡 <span className="font-semibold">Consejo de Wilma:</span> La combinación más elegante suele ser una base fuerte (ej. 45% Classic) equilibrada con funcionalidad (Natural) y una pizca de autor (Creative).
              </div>
            </div>
          )}

          {/* STEP 3: Your Colors */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <span className="w-10 h-10 rounded-2xl bg-[#EFE8DC] text-[#C5A059] inline-flex items-center justify-center mb-2">
                  <Palette className="w-5 h-5" />
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Tu Colorimetría
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Descubre tu estación analítica según la temperatura e intensidad de tus rasgos.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  ¿Cómo reacciona tu piel y qué joyas te favorecen más?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'calido', label: 'Cálido (Oro amarillo, piel dorada al sol)' },
                    { id: 'frio', label: 'Frío (Plata pulida, piel rosada/rojez)' },
                    { id: 'neutro', label: 'Neutro (Ambos metales funcionan)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUndertone(item.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                        undertone === item.id
                          ? 'border-[#C86D51] bg-[#C86D51]/10 text-[#A44C32] font-semibold'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Selecciona tu Estación Analítica:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {(Object.keys(COLOR_PALETTES) as ColorSeason[]).map((season) => {
                    const isSelected = selectedSeason === season;
                    const p = COLOR_PALETTES[season];
                    return (
                      <button
                        key={season}
                        type="button"
                        onClick={() => setSelectedSeason(season)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#C86D51] bg-[#C86D51]/10 shadow-xs'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-semibold text-stone-900">{season}</div>
                        <div className="flex gap-1 mt-1.5">
                          {p.palette.slice(0, 3).map((col, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-2xs"
                              style={{ backgroundColor: col.hex }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Your Body & Comfort */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <span className="w-10 h-10 rounded-2xl bg-[#EFE8DC] text-[#556B2F] inline-flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5" />
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Cuerpo & Confort Innegociable
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  La elegancia empieza cuando puedes respirar y caminar con naturalidad.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Tipo de Silueta ósea
                </label>
                <select
                  value={silhouette}
                  onChange={(e) => setSilhouette(e.target.value as BodySilhouette)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Reloj de Arena">Reloj de Arena (Hombros y cadera alineados, cintura definida)</option>
                  <option value="Rectángulo">Rectángulo (Líneas rectas, hombros y caderas alineados, cintura suave)</option>
                  <option value="Triángulo (Pera)">Triángulo / Pera (Caderas más prominentes que los hombros)</option>
                  <option value="Triángulo Invertido">Triángulo Invertido (Espalda y hombros más anchos que la cadera)</option>
                  <option value="Óvalo (Manzana)">Óvalo / Manzana (Volumen concentrado en el torso medio)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Altura máxima de tacón en tu día a día
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Plano absoluto (0 - 2 cm)',
                    'Sensato / Kitten (3 - 5 cm)',
                    'Medio (6 - 8 cm)',
                    'Tacón alto (+9 cm)',
                  ].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setMaxHeel(h)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        maxHeel === h
                          ? 'border-[#C86D51] bg-[#C86D51]/10 text-[#A44C32] font-semibold'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                  <span>Prioridad de comodidad (1 al 10)</span>
                  <span className="text-[#556B2F] font-mono">{comfortPriority}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={comfortPriority}
                  onChange={(e) => setComfortPriority(Number(e.target.value))}
                  className="w-full accent-[#556B2F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Prendas vetadas o que NO toleras llevar (separadas por comas)
                </label>
                <input
                  type="text"
                  value={rejectedItems}
                  onChange={(e) => setRejectedItems(e.target.value)}
                  placeholder="Ej. Pantalón tiro bajo, jerséis que piquen, hombreras gigantes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Your Results */}
          {step === 5 && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#1C1917] text-[#C5A059] mx-auto flex items-center justify-center font-serif text-2xl shadow-md">
                W
              </div>

              <h3 className="font-serif text-2xl font-bold text-stone-900">
                ¡Tu Pasaporte Style DNA está listo!
              </h3>

              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Wilma ha calibrado tu cerebro de estilo con tus datos reales.
              </p>

              {/* Passport Preview Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8DEC9] text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">
                    Pasaporte Personal
                  </span>
                  <span className="text-xs font-mono text-stone-400">ID: W-{name.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">COLOR DNA</span>
                    <span className="font-semibold text-stone-800">{selectedSeason}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">SILUETA</span>
                    <span className="font-semibold text-stone-800">{silhouette}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">DISTRIBUCIÓN</span>
                    <span className="font-semibold text-stone-800">
                      C:{classic}% N:{natural}% Cr:{creative}%
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">TACÓN MÁXIMO</span>
                    <span className="font-semibold text-stone-800">{maxHeel}</span>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] mb-1">PALETA ESTRELLA</span>
                  <div className="flex gap-1.5">
                    {COLOR_PALETTES[selectedSeason]?.palette.slice(0, 5).map((col, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border border-stone-200"
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-5 py-4 border-t border-[#EBE3D5] bg-white flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-black text-[#FAF6F0] text-xs font-semibold shadow-sm transition-all"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#C86D51] hover:bg-[#A8523A] text-white text-xs font-semibold shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Activar mi Style DNA</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
