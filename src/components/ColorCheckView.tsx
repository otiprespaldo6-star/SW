import React, { useState } from 'react';
import { UserProfile, ColorCheckResult } from '../types';
import { GeminiService } from '../services/geminiService';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  Palette,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';

interface ColorCheckViewProps {
  profile: UserProfile;
  isOpen?: boolean;
  onClose?: () => void;
}

export const ColorCheckView: React.FC<ColorCheckViewProps> = ({
  profile,
  isOpen = true,
  onClose,
}) => {
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>({
    name: 'Terracota Cálido',
    hex: '#C86D51',
  });
  const [customHex, setCustomHex] = useState('#C86D51');
  const [result, setResult] = useState<ColorCheckResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const testColors = [
    { name: 'Terracota Cálido', hex: '#C86D51' },
    { name: 'Verde Oliva Profundo', hex: '#556B2F' },
    { name: 'Camel Dorado', hex: '#C19A6B' },
    { name: 'Negro Azabache Puro', hex: '#000000' },
    { name: 'Fucsia Neón Frío', hex: '#FF007F' },
    { name: 'Blanco Óptico', hex: '#FFFFFF' },
    { name: 'Azul Marino Tinta', hex: '#1C2841' },
    { name: 'Mostaza Especiada', hex: '#E1AD01' },
    { name: 'Gris Plomo Frío', hex: '#4A5568' },
  ];

  const handleTestColor = async (color: { name: string; hex: string }) => {
    setSelectedColor(color);
    setCustomHex(color.hex);
    const check = await GeminiService.checkColor(color.name, color.hex, profile);
    setResult(check);
  };

  const handleCustomHexChange = async (hex: string) => {
    setCustomHex(hex);
    const custom = { name: 'Color Personalizado', hex };
    setSelectedColor(custom);
    const check = await GeminiService.checkColor(custom.name, hex, profile);
    setResult(check);
  };

  // Evaluate initial color on first load
  React.useEffect(() => {
    handleTestColor(selectedColor);
  }, []);

  return (
    <div className="space-y-5 pb-20">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#C86D51] text-[11px] font-semibold tracking-wide mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>Diagnóstico Cromático Express</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
            ¿Este color es para mí?
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Compara cualquier tono con tu estación ({profile.colorDna.season}) y aprende el truco de estilista para llevarlo.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Swatch & Live Tester Box */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        {/* Active color banner preview */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div
            className="w-16 h-16 rounded-2xl shadow-inner border border-black/10 shrink-0 transition-all duration-300"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Tono Seleccionado
            </span>
            <span className="font-serif text-lg font-bold text-stone-900 block">
              {selectedColor.name}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-stone-500">{selectedColor.hex}</span>
              <label className="text-[11px] font-semibold text-[#C86D51] cursor-pointer hover:underline">
                Elegir otro hex
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => handleCustomHexChange(e.target.value)}
                  className="opacity-0 w-0 h-0"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Quick Swatches Grid */}
        <div>
          <span className="text-xs font-semibold text-stone-700 block mb-2">
            Toca un tono para probarlo:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {testColors.map((c, i) => {
              const isSelected = selectedColor.hex === c.hex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleTestColor(c)}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                    isSelected
                      ? 'border-[#C86D51] bg-[#C86D51]/10 shadow-2xs font-semibold'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[11px] text-stone-800 truncate">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-3xl p-5 border border-[#E8DEC9] shadow-md space-y-4 animate-in fade-in duration-300">
          {/* Status Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              {result.matchStatus === 'Color Estrella' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              ) : result.matchStatus === 'Neutro Armonioso' ? (
                <ShieldCheck className="w-6 h-6 text-sky-600" />
              ) : result.matchStatus === 'Favorecedor' ? (
                <Sparkles className="w-6 h-6 text-amber-500" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              )}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                  Calificación para {profile.colorDna.season}
                </span>
                <span className="font-serif text-lg font-bold text-stone-900 block">
                  {result.matchStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-xs text-stone-700 leading-relaxed">
            {result.explanation}
          </p>

          {/* How to wear / stylist trick */}
          <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E5DAC5] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#A44C32]">
              <Lightbulb className="w-4 h-4 text-[#C86D51]" />
              <span>El truco de estilista de Wilma:</span>
            </div>
            <p className="text-xs text-stone-800 leading-relaxed">
              {result.howToWearTip}
            </p>
          </div>

          {/* Best pairings */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Mejores Combinaciones
            </span>
            <ul className="space-y-1 text-xs text-stone-700">
              {result.bestPairings.map((pair, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#C86D51] font-bold">•</span>
                  <span>{pair}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
