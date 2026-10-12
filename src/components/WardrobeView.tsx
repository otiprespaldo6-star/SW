import React, { useState } from 'react';
import { UserProfile, WardrobeItem } from '../types';
import { StorageService } from '../services/storage';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  FolderHeart,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  Upload,
  X,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface WardrobeViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateToChatWithQuery: (query: string) => void;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToChatWithQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [outfitSuggestion, setOutfitSuggestion] = useState<{
    title: string;
    description: string;
    items: WardrobeItem[];
  } | null>(null);

  // New item form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WardrobeItem['category']>('tops');
  const [colorName, setColorName] = useState('Terracota Cálido');
  const [colorHex, setColorHex] = useState('#C86D51');
  const [occasion, setOccasion] = useState<WardrobeItem['occasion']>('Versátil');
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop&q=80'
  );
  const [notes, setNotes] = useState('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'Todo' },
    { id: 'tops', label: 'Tops & Camisas' },
    { id: 'bottoms', label: 'Pantalones & Faldas' },
    { id: 'dresses', label: 'Vestidos' },
    { id: 'outerwear', label: 'Abrigos & Blazers' },
    { id: 'shoes', label: 'Calzado' },
    { id: 'bags', label: 'Bolsos' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? profile.wardrobe
      : profile.wardrobe.filter((item) => item.category === selectedCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = () => {
    if (!name.trim()) return;

    const newItem: WardrobeItem = {
      id: `w-${Date.now()}`,
      name: name.trim(),
      category,
      colorName,
      colorHex,
      occasion,
      imageUrl: imagePreview,
      tags: [occasion, colorName],
      notes: notes.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = StorageService.addWardrobeItem(newItem);
    onUpdateProfile(updated);
    setIsAddModalOpen(false);
    // Reset
    setName('');
    setNotes('');
  };

  const handleDeleteItem = (id: string) => {
    const updated = StorageService.removeWardrobeItem(id);
    onUpdateProfile(updated);
  };

  const handleGenerateOutfit = () => {
    const tops = profile.wardrobe.filter((i) => i.category === 'tops');
    const bottoms = profile.wardrobe.filter((i) => i.category === 'bottoms');
    const outerwear = profile.wardrobe.filter((i) => i.category === 'outerwear');
    const shoes = profile.wardrobe.filter((i) => i.category === 'shoes');
    const dresses = profile.wardrobe.filter((i) => i.category === 'dresses');

    if (dresses.length > 0 && Math.random() > 0.5) {
      const dress = dresses[0];
      const jacket = outerwear[0];
      const shoe = shoes[0];
      setOutfitSuggestion({
        title: 'Fórmula One-Piece Elegante',
        description: `Un look fluido que alarga la silueta ${profile.bodyDna.silhouette}. La tercera pieza (${jacket?.name || 'blazer'}) enmarca los hombros con autoridad.`,
        items: [dress, jacket, shoe].filter(Boolean) as WardrobeItem[],
      });
    } else {
      const top = tops[0] || profile.wardrobe[0];
      const bottom = bottoms[0] || profile.wardrobe[1];
      const jacket = outerwear[0];
      const shoe = shoes[0];
      setOutfitSuggestion({
        title: 'Trilogía Sastre & Confort',
        description: `Equilibrio impecable: 70% Classic (corte sastre y caída limpia) con el confort natural de tus prendas clave. Colores en perfecta sintonía con tu ${profile.colorDna.season}.`,
        items: [top, bottom, jacket, shoe].filter(Boolean) as WardrobeItem[],
      });
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#C86D51] text-[11px] font-semibold tracking-wide mb-2">
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Armario Digital Progresivo</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
            Mi Armario
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {profile.wardrobe.length} prendas registradas y optimizadas para tu Style DNA.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1917] hover:bg-black text-[#FAF6F0] text-xs font-semibold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Añadir</span>
        </button>
      </div>

      {/* Outfit Generator Action Button */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F4EFE6] to-[#FBF9F5] border border-[#E5DAC5] flex items-center justify-between shadow-xs">
        <div>
          <span className="text-xs font-bold text-stone-900 block">
            ¿No sabes qué ponerte hoy?
          </span>
          <span className="text-[11px] text-stone-600 block">
            Combina automáticamente piezas de tu armario.
          </span>
        </div>
        <button
          onClick={handleGenerateOutfit}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C86D51] hover:bg-[#A8523A] text-white text-xs font-semibold shadow-xs transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sugerir Outfit</span>
        </button>
      </div>

      {/* Generated Outfit Display Modal/Card */}
      {outfitSuggestion && (
        <div className="bg-white rounded-3xl p-5 border border-[#E8DEC9] shadow-md space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#C86D51] tracking-wider block">
                Fórmula Wilma Sugerida
              </span>
              <h3 className="font-serif text-base font-bold text-stone-900">
                {outfitSuggestion.title}
              </h3>
            </div>
            <button
              onClick={() => setOutfitSuggestion(null)}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            {outfitSuggestion.description}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {outfitSuggestion.items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50 p-1.5 text-center"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-20 object-cover rounded-lg mb-1"
                />
                <span className="text-[11px] font-semibold text-stone-800 line-clamp-1 block">
                  {item.name}
                </span>
                <span className="text-[10px] text-stone-500">{item.colorName}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              onNavigateToChatWithQuery(
                `¿Cómo puedo accesorizar este look sugerido: ${outfitSuggestion.items.map((i) => i.name).join(' + ')}?`
              );
            }}
            className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors mt-2"
          >
            Preguntar a Wilma cómo accesorizarlo en Chat →
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#1C1917] text-[#FAF6F0] shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Wardrobe Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white border border-[#EAE2D5] overflow-hidden flex flex-col justify-between shadow-xs group"
          >
            <div className="relative h-44 bg-stone-100 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
                {item.occasion}
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 hover:bg-rose-50 hover:text-rose-600 text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Eliminar del armario"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3">
              <span className="font-serif text-sm font-semibold text-stone-900 line-clamp-1 block">
                {item.name}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: item.colorHex }}
                />
                <span className="text-[11px] text-stone-500 truncate">
                  {item.colorName}
                </span>
              </div>
              {item.notes && (
                <p className="text-[11px] text-stone-400 mt-1 line-clamp-1 italic">
                  "{item.notes}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Garment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FBF9F5] w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl border border-[#E8DEC9] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
            <div className="px-5 py-4 border-b border-[#EBE3D5] flex items-center justify-between bg-white">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Añadir Prenda al Armario
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nombre de la prenda
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Gabardina fluida, Camisa lino..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="tops">Tops & Camisas</option>
                  <option value="bottoms">Pantalones & Faldas</option>
                  <option value="dresses">Vestidos</option>
                  <option value="outerwear">Abrigos & Chaquetas</option>
                  <option value="shoes">Calzado</option>
                  <option value="bags">Bolsos</option>
                  <option value="accessories">Accesorios / Joyería</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Nombre del Color
                  </label>
                  <input
                    type="text"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Tono aproximado
                  </label>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-7 h-7 rounded border-none cursor-pointer"
                    />
                    <span className="text-xs font-mono text-stone-600">{colorHex}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Ocasión principal
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Trabajo">Trabajo / Oficina</option>
                  <option value="Casual">Casual / Diario</option>
                  <option value="Cena/Noche">Cena / Noche</option>
                  <option value="Eventos">Eventos / Celebración</option>
                  <option value="Versátil">Versátil (Todo uso)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Foto de la prenda
                </label>
                <div className="relative rounded-xl overflow-hidden border border-stone-200 h-36 bg-stone-100 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Prenda"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-semibold hover:bg-black flex items-center gap-1 shadow-sm"
                      title="Tomar foto de la prenda con cámara"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Cámara</span>
                    </button>

                    <label className="px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-semibold cursor-pointer hover:bg-black flex items-center gap-1 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Archivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Notas de estilismo (opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Queda ideal con cinturón fino y arremangada..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#EBE3D5] bg-white flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveItem}
                disabled={!name.trim()}
                className="px-5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-semibold hover:bg-black disabled:opacity-50"
              >
                Guardar en Armario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(dataUrl) => {
          setImagePreview(dataUrl);
        }}
        title="Fotografiar Prenda para Mi Armario"
        subtitle="Coloca la prenda en plano o percha con buena iluminación"
        defaultFacingMode="environment"
      />
    </div>
  );
};
