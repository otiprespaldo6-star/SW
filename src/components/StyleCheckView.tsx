import React, { useState } from 'react';
import { UserProfile, LookCheckResult } from '../types';
import { GeminiService } from '../services/geminiService';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface StyleCheckViewProps {
  profile: UserProfile;
}

export const StyleCheckView: React.FC<StyleCheckViewProps> = ({ profile }) => {
  const [occasion, setOccasion] = useState('Reunión de trabajo / Oficina');
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<LookCheckResult | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const sampleLooks = [
    {
      title: 'Look Sastre Camel & Jeans',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Vestido Midi & Zapatillas',
      url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Total Look Monocromático',
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    try {
      const analysis = await GeminiService.analyzeLook(
        occasion,
        profile,
        imagePreview
      );
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#C86D51] text-[11px] font-semibold tracking-wide mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Style Check con IA</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
          Analiza mi look
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
          Sube tu foto de hoy y Wilma evaluará la coherencia con tu Style DNA ({profile.colorDna.season}, {profile.bodyDna.silhouette}) y te dará micro-ajustes para elevarlo de 7 a 10.
        </p>
      </div>

      {/* Responsive Two-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Form & Photo */}
        <div className="lg:col-span-5 space-y-4">
          {/* Occasion Selector */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <label className="text-xs font-semibold text-stone-700 block">
              ¿Para qué ocasión es este look?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Reunión de trabajo / Oficina',
                'Cena con amigos / Pareja',
                'Evento formal / Fiesta',
                'Casual chic de fin de semana',
              ].map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    occasion === occ
                      ? 'border-[#C86D51] bg-[#C86D51]/10 text-[#A44C32] font-semibold'
                      : 'border-stone-200 bg-white text-stone-700'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload / Preview Box */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">
                Foto de cuerpo entero
              </label>
              <div className="text-[11px] text-stone-400">Frente al espejo o tomada por alguien</div>
            </div>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 h-72 sm:h-80 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Preview Look"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-sm text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-md"
                    title="Tomar foto con cámara frontal o trasera"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Usar Cámara</span>
                  </button>

                  <label className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm text-white text-xs font-semibold cursor-pointer hover:bg-black transition-colors flex items-center gap-1.5 shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Galería</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#DED4C5] rounded-2xl p-6 flex flex-col items-center justify-center bg-[#FBF9F5] transition-all space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EFE8DC] text-[#C86D51] flex items-center justify-center">
                  <Camera className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold text-stone-800 block">
                    Captura o sube tu look de hoy
                  </span>
                  <span className="text-[11px] text-stone-400 mt-0.5 block">
                    Compatible con cámara frontal/trasera y laptop
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#1C1917] text-[#C5A059] hover:bg-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Abrir Cámara</span>
                  </button>

                  <label className="flex-1 py-2 px-3 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-stone-500" />
                    <span>Galería</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Sample preset buttons */}
            <div>
              <span className="text-[11px] text-stone-500 block mb-1.5">
                O prueba con fotos de muestra:
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {sampleLooks.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setImagePreview(sample.url);
                      setResult(null);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-[#FBF9F5] text-[11px] text-stone-700 whitespace-nowrap hover:border-[#C5A059]"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!imagePreview || isAnalyzing}
              className="w-full py-3 rounded-xl bg-[#1C1917] hover:bg-black text-[#FAF6F0] text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#C5A059] animate-spin" />
                  <span>Analizando proporciones y colores...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Analizar Look con Wilma</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Result Card or Empty State */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DEC9] shadow-md space-y-4 animate-in fade-in duration-300">
              {/* Header Score */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C86D51] block">
                    Veredicto de Wilma
                  </span>
                  <div className="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
                    {result.verdict}
                  </div>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F4EFE6] border border-[#E2D5BE] flex flex-col items-center justify-center text-[#1C1917] shrink-0">
                  <span className="text-xl sm:text-2xl font-bold font-serif leading-none">
                    {result.score}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">
                    de 10
                  </span>
                </div>
              </div>

              {/* Micro Tweaks */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F4EFE6] to-[#FAF6F0] border border-[#E5DAC5] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#A44C32]">
                  <Sparkles className="w-4 h-4 text-[#C86D51]" />
                  <span>Micro-ajustes de Wilma para elevarlo a 10:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-800">
                  {result.wilmaTweaks.map((tweak, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#C86D51] text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{tweak}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-stone-200 bg-[#FBF9F5]">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                    COLOR & LUZ ({profile.colorDna.season})
                  </span>
                  <p className="text-stone-700 leading-relaxed">
                    {result.harmonyAnalysis.color}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 bg-[#FBF9F5]">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                    SILUETA ({profile.bodyDna.silhouette})
                  </span>
                  <p className="text-stone-700 leading-relaxed">
                    {result.harmonyAnalysis.proportions}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 bg-[#FBF9F5]">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                    ESTILO ({profile.styleDna.primary})
                  </span>
                  <p className="text-stone-700 leading-relaxed">
                    {result.harmonyAnalysis.styleCoherence}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 bg-[#FBF9F5]">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                    CONTEXTO ({occasion})
                  </span>
                  <p className="text-stone-700 leading-relaxed">
                    {result.harmonyAnalysis.occasionFit}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-[#E0D5C3] text-center flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-12 h-12 rounded-2xl bg-[#EFE8DC] text-[#C86D51] flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                Listo para analizar tu look
              </h3>
              <p className="text-xs text-stone-500 max-w-sm">
                Selecciona la foto y haz clic en "Analizar Look con Wilma". Recibirás una crítica constructiva con soluciones prácticas inmediatas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Universal Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(dataUrl) => {
          setImagePreview(dataUrl);
          setResult(null);
        }}
        title="Tomar Foto de Tu Look Completo"
        subtitle="Usa la cámara frontal frente al espejo o la trasera"
        defaultFacingMode="user"
      />
    </div>
  );
};
