import React, { useState } from 'react';
import { UserProfile, BuyCheckResult } from '../types';
import { GeminiService } from '../services/geminiService';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  ShoppingBag,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  DollarSign,
  Tag,
} from 'lucide-react';

interface BuyCheckViewProps {
  profile: UserProfile;
}

export const BuyCheckView: React.FC<BuyCheckViewProps> = ({ profile }) => {
  const [itemName, setItemName] = useState('Pantalón sastre fluido terracota en Massimo Dutti');
  const [price, setPrice] = useState('89,95 €');
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=500&auto=format&fit=crop&q=80'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<BuyCheckResult | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const sampleItems = [
    {
      title: 'Pantalón Sastre Terracota',
      price: '89 €',
      url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=500&auto=format&fit=crop&q=80',
    },
    {
      title: 'Vestido Camisero Algodón',
      price: '110 €',
      url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80',
    },
    {
      title: 'Jersey Fucsia Neón (Prueba color)',
      price: '65 €',
      url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80',
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

  const handleEvaluate = async () => {
    if (!itemName.trim()) return;
    setIsEvaluating(true);
    try {
      const evaluation = await GeminiService.evaluatePurchase(
        itemName,
        price,
        profile,
        imagePreview || undefined
      );
      setResult(evaluation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#C86D51] text-[11px] font-semibold tracking-wide mb-2">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Filtro de Compra Inteligente</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
          ¿Me lo compro?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Antes de pasar la tarjeta en el probador o en la web, consulta con Wilma si encaja con tu Style DNA y si combina con lo que ya posees.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            Prenda y tienda
          </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Ej. Gabardina fluida verde militar en COS"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF9F5] text-xs focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            Precio estimado
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej. 120 €"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF9F5] text-xs focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Photo Box */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">
            Foto de la prenda (opcional)
          </label>
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 h-44 bg-stone-100 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Prenda candidata"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-black/80 text-white text-[11px] font-semibold hover:bg-black transition-colors flex items-center gap-1 shadow-sm"
                  title="Tomar foto de la prenda en probador"
                >
                  <Camera className="w-3 h-3 text-[#C5A059]" />
                  <span>Cámara</span>
                </button>

                <label className="px-2.5 py-1 rounded-lg bg-black/60 text-white text-[11px] font-semibold cursor-pointer hover:bg-black transition-colors flex items-center gap-1 shadow-sm">
                  <Upload className="w-3 h-3" />
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
            <div className="border-2 border-dashed border-[#DED4C5] rounded-xl p-4 flex flex-col items-center justify-center bg-[#FBF9F5] transition-all space-y-2">
              <span className="text-xs font-semibold text-stone-800">
                Foto en el probador o de la tienda
              </span>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1C1917] text-[#C5A059] text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Tomar con Cámara</span>
                </button>

                <label className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-stone-500" />
                  <span>Subir Foto</span>
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
        </div>

        {/* Sample buttons */}
        <div>
          <span className="text-[11px] text-stone-400 block mb-1">
            Probar con ejemplos:
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {sampleItems.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setItemName(sample.title);
                  setPrice(sample.price);
                  setImagePreview(sample.url);
                  setResult(null);
                }}
                className="px-2.5 py-1 rounded-xl border border-stone-200 bg-[#FBF9F5] text-[11px] text-stone-700 whitespace-nowrap hover:border-[#C5A059]"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Evaluate Button */}
        <button
          onClick={handleEvaluate}
          disabled={!itemName.trim() || isEvaluating}
          className="w-full py-3 rounded-xl bg-[#C86D51] hover:bg-[#A8523A] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          {isEvaluating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cruzando con tu Style DNA y armario...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Pedir Veredicto a Wilma</span>
            </>
          )}
        </button>
      </div>

      {/* Decision Card */}
      {result && (
        <div className="bg-white rounded-3xl p-5 border border-[#E8DEC9] shadow-md space-y-4 animate-in fade-in duration-300">
          {/* Verdict Banner */}
          <div
            className={`p-4 rounded-2xl flex items-center justify-between border ${
              result.verdict.includes('sin dudar')
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : result.verdict.includes('Piénsalo')
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.verdict.includes('sin dudar') ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : result.verdict.includes('Piénsalo') ? (
                <AlertCircle className="w-8 h-8 text-amber-600 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
              )}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
                  Veredicto Final
                </span>
                <span className="font-serif text-lg font-bold leading-tight block">
                  {result.verdict}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-bold font-serif leading-none block">
                {result.score}%
              </span>
              <span className="text-[9px] uppercase tracking-wider opacity-75 font-semibold">
                Compatibilidad
              </span>
            </div>
          </div>

          {/* Stylist Tip */}
          <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-stone-200 text-xs text-stone-800 space-y-1">
            <span className="font-bold text-[#C86D51] block text-[11px] uppercase tracking-wider">
              La Opinión de Wilma
            </span>
            <p className="leading-relaxed">{result.stylistTip}</p>
          </div>

          {/* Wardrobe Combinations */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              3 Combinaciones con tu Armario Actual
            </span>
            <div className="space-y-1.5">
              {result.wardrobePairings.map((pair, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-stone-100 bg-stone-50 text-xs text-stone-700 flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-[#1C1917] text-[#C5A059] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span>{pair}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dimensions Breakdown */}
          <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
            <div className="p-2.5 rounded-xl border border-stone-200 bg-[#FBF9F5]">
              <span className="text-[10px] font-bold text-stone-400 block mb-0.5">
                COLORIMETRÍA
              </span>
              <p className="text-stone-700 text-[11px] leading-snug">
                {result.colorAnalysis}
              </p>
            </div>
            <div className="p-2.5 rounded-xl border border-stone-200 bg-[#FBF9F5]">
              <span className="text-[10px] font-bold text-stone-400 block mb-0.5">
                SILUETA & CORTE
              </span>
              <p className="text-stone-700 text-[11px] leading-snug">
                {result.bodyFitAnalysis}
              </p>
            </div>
          </div>

          {/* Price per wear */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span className="text-[11px] font-medium">Coste por uso (Price per wear):</span>
            <span className="font-semibold text-stone-900">{result.pricePerWearVerdict}</span>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(dataUrl) => {
          setImagePreview(dataUrl);
          setResult(null);
        }}
        title="Tomar Foto de la Prenda"
        subtitle="Fotografía la prenda en la percha o puesta en el probador"
        defaultFacingMode="environment"
      />
    </div>
  );
};
