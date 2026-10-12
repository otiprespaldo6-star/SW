import React from 'react';
import { UserProfile } from '../types';
import { NavTab } from './BottomNav';
import { WILMA_DAILY_TIPS } from '../data/defaultStyleDna';
import {
  Sparkles,
  ShoppingBag,
  ScanLine,
  Palette,
  FolderHeart,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Dna,
  Calendar as CalendarIcon,
  Clock,
  Star,
} from 'lucide-react';

interface HomeViewProps {
  profile: UserProfile;
  onNavigate: (tab: NavTab) => void;
  onOpenStyleDna: () => void;
  onOpenColorModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  onNavigate,
  onOpenStyleDna,
  onOpenColorModal,
}) => {
  // Random or daily tip based on day of week
  const todayTipIndex = new Date().getDay() % WILMA_DAILY_TIPS.length;
  const dailyTip = WILMA_DAILY_TIPS[todayTipIndex];

  // Pick top 2 items from wardrobe for today's look preview
  const blazer = profile.wardrobe.find((i) => i.category === 'outerwear') || profile.wardrobe[0];
  const top = profile.wardrobe.find((i) => i.category === 'tops') || profile.wardrobe[1];
  const bottom = profile.wardrobe.find((i) => i.category === 'bottoms') || profile.wardrobe[2];

  return (
    <div className="space-y-6 pb-20">
      {/* Central Question & Hero Header */}
      <section className="bg-gradient-to-b from-[#F4EFE6] to-[#FBF9F5] p-5 rounded-3xl border border-[#E9DEC9] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-[#E5D7BF]/30 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1917] text-[#EAE3D9] text-[11px] font-medium tracking-wide mb-3">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span>Asesora Activa · {profile.colorDna.season}</span>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917] leading-tight mb-2">
            ¿Qué necesitas hoy, {profile.name.split(' ')[0]}?
          </h1>

          <p className="text-sm text-stone-600 leading-relaxed max-w-sm">
            No te digo cómo verte; te enseño a proyectar quién eres con tu paleta, tus proporciones y tu armario real.
          </p>

          {/* Style DNA Compact Passport Card */}
          <div
            onClick={onOpenStyleDna}
            className="mt-4 p-3.5 rounded-2xl bg-white/90 border border-[#EBE1D0] backdrop-blur-sm cursor-pointer hover:border-[#C5A059] transition-all shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {/* Palette dots */}
              <div className="flex -space-x-1">
                {profile.colorDna.palette.slice(0, 4).map((c, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-stone-900">
                    {profile.styleDna.primary}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Silueta {profile.bodyDna.silhouette} · {profile.colorDna.season}
                </div>
              </div>
            </div>

            <div className="flex items-center text-xs font-semibold text-[#C86D51] gap-1">
              <span>Mi ADN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Calendar & Today's Outfit Highlight Widget */}
      {(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayOutfit = (profile.outfitCalendar || []).find((p) => p.date === todayStr);
        const upcomingOutfits = (profile.outfitCalendar || [])
          .filter((p) => p.date >= todayStr)
          .slice(0, 3);

        return (
          <section className="bg-white p-5 rounded-3xl border border-[#E9DEC9] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] text-[#C86D51] flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-stone-900 leading-tight">
                    Agenda de Outfits & Hábitos
                  </h2>
                  <span className="text-[11px] text-stone-500">
                    La IA aprende de tus días y elecciones
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-semibold text-[#C86D51] hover:underline flex items-center gap-1"
              >
                <span>Abrir Calendario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayOutfit ? (
              <div
                onClick={() => onNavigate('calendar')}
                className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE1D0] cursor-pointer hover:border-[#C5A059] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059] text-white">
                      LOOK DE HOY
                    </span>
                    <span className="text-xs font-semibold text-stone-800">
                      {todayOutfit.occasion}
                    </span>
                    {todayOutfit.status === 'worn' && (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        ✓ Usado ({todayOutfit.rating}★)
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1C1917]">
                    {todayOutfit.title}
                  </h3>
                  {todayOutfit.aiStylistAdvice && (
                    <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                      {todayOutfit.aiStylistAdvice}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {profile.wardrobe
                    .filter((w) => todayOutfit.itemIds.includes(w.id))
                    .slice(0, 4)
                    .map((item) => (
                      <img
                        key={item.id}
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E5DAC6]"
                        title={item.name}
                      />
                    ))}
                </div>
              </div>
            ) : (
              <div
                onClick={() => onNavigate('calendar')}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#DCD0BE] cursor-pointer hover:bg-[#F4EFE6] transition-all text-center"
              >
                <span className="text-xs font-semibold text-[#1C1917] block">
                  No has planificado tu look para hoy
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Haz clic para pedirle a Wilma que elija una combinación según tu agenda.
                </span>
              </div>
            )}
          </section>
        );
      })()}

      {/* Main Core Functions Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-serif text-lg font-semibold text-stone-900 tracking-tight">
            Tus Herramientas de Estilo
          </h2>
          <span className="text-xs text-stone-500 font-medium">Powered by Gemini</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Chat con Wilma */}
          <button
            onClick={() => onNavigate('chat')}
            className="p-4 rounded-2xl bg-white border border-[#EAE2D5] hover:border-[#C5A059] text-left transition-all hover:shadow-md flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1C1917] text-[#C5A059] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#C86D51] transition-colors">
                Hablar con Wilma
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Consulta qué ponerte para hoy o cómo combinar piezas clave.
              </p>
            </div>
            <div className="mt-3 flex items-center text-[11px] font-semibold text-stone-700 gap-1">
              <span>Iniciar chat</span>
              <ArrowRight className="w-3 h-3 text-[#C86D51]" />
            </div>
          </button>

          {/* Card 2: Calendario de Outfits */}
          <button
            onClick={() => onNavigate('calendar')}
            className="p-4 rounded-2xl bg-white border border-[#EAE2D5] hover:border-[#C5A059] text-left transition-all hover:shadow-md flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#C5A059] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#C86D51] transition-colors">
                Calendario Outfits
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Planifica tu semana y entrena a la IA con tus hábitos.
              </p>
            </div>
            <div className="mt-3 flex items-center text-[11px] font-semibold text-stone-700 gap-1">
              <span>Ver agenda</span>
              <ArrowRight className="w-3 h-3 text-[#C86D51]" />
            </div>
          </button>

          {/* Card 3: ¿Me lo compro? */}
          <button
            onClick={() => onNavigate('comprar')}
            className="p-4 rounded-2xl bg-white border border-[#EAE2D5] hover:border-[#C5A059] text-left transition-all hover:shadow-md flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#C86D51] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#C86D51] transition-colors">
                ¿Me lo compro?
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Sube foto o describe la prenda en tienda para recibir veredicto.
              </p>
            </div>
            <div className="mt-3 flex items-center text-[11px] font-semibold text-stone-700 gap-1">
              <span>Evaluar compra</span>
              <ArrowRight className="w-3 h-3 text-[#C86D51]" />
            </div>
          </button>

          {/* Card 4: Analiza mi look */}
          <button
            onClick={() => onNavigate('stylecheck')}
            className="p-4 rounded-2xl bg-white border border-[#EAE2D5] hover:border-[#C5A059] text-left transition-all hover:shadow-md flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#556B2F] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#C86D51] transition-colors">
                Analiza mi look
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Style Check de cuerpo entero con micro-ajustes para elevarlo.
              </p>
            </div>
            <div className="mt-3 flex items-center text-[11px] font-semibold text-stone-700 gap-1">
              <span>Hacer check</span>
              <ArrowRight className="w-3 h-3 text-[#C86D51]" />
            </div>
          </button>

          {/* Card 5: ¿Este color es para mí? */}
          <button
            onClick={onOpenColorModal}
            className="p-4 rounded-2xl bg-white border border-[#EAE2D5] hover:border-[#C5A059] text-left transition-all hover:shadow-md flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#8B8589] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#C86D51] transition-colors">
                ¿Este color me va?
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Comprueba si un tono entra en tu Color DNA y cómo adaptarlo.
              </p>
            </div>
            <div className="mt-3 flex items-center text-[11px] font-semibold text-stone-700 gap-1">
              <span>Verificar color</span>
              <ArrowRight className="w-3 h-3 text-[#C86D51]" />
            </div>
          </button>
        </div>
      </section>

      {/* Bottom Section: Outfit Idea & Wilma Tip Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Today's Curated Outfit Idea */}
        <section className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#E8DEC9] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#556B2F]" />
                <h2 className="font-serif text-base font-semibold text-stone-900">
                  Fórmula de Hoy con tu Armario
                </h2>
              </div>
              <button
                onClick={() => onNavigate('armario')}
                className="text-xs text-[#C86D51] font-semibold hover:underline flex items-center gap-1"
              >
                Ver armario ({profile.wardrobe.length})
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4">
              Combinación calibrada para tu agenda ({profile.lifestyleDna.workMode}) y silueta {profile.bodyDna.silhouette}:
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {blazer && (
                <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 p-2 text-center">
                  <img
                    src={blazer.imageUrl}
                    alt={blazer.name}
                    className="w-full h-24 object-cover rounded-xl mb-1.5"
                  />
                  <span className="text-[11px] font-semibold text-stone-800 line-clamp-1 block">
                    {blazer.name}
                  </span>
                  <span className="text-[10px] text-stone-500">{blazer.colorName}</span>
                </div>
              )}
              {top && (
                <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 p-2 text-center">
                  <img
                    src={top.imageUrl}
                    alt={top.name}
                    className="w-full h-24 object-cover rounded-xl mb-1.5"
                  />
                  <span className="text-[11px] font-semibold text-stone-800 line-clamp-1 block">
                    {top.name}
                  </span>
                  <span className="text-[10px] text-stone-500">{top.colorName}</span>
                </div>
              )}
              {bottom && (
                <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 p-2 text-center">
                  <img
                    src={bottom.imageUrl}
                    alt={bottom.name}
                    className="w-full h-24 object-cover rounded-xl mb-1.5"
                  />
                  <span className="text-[11px] font-semibold text-stone-800 line-clamp-1 block">
                    {bottom.name}
                  </span>
                  <span className="text-[10px] text-stone-500">{bottom.colorName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#556B2F]" />
              <span>Respeta tu tacón máx ({profile.comfortDna.maxHeelHeight})</span>
            </div>
            <button
              onClick={() => onNavigate('chat')}
              className="text-xs font-semibold text-[#1C1917] hover:text-[#C86D51] transition-colors"
            >
              Personalizar look →
            </button>
          </div>
        </section>

        {/* Daily Wilma Tip */}
        <section className="lg:col-span-5 bg-gradient-to-br from-[#24201D] to-[#1C1917] text-[#FAF6F0] p-6 rounded-3xl shadow-sm border border-stone-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#C5A059] text-xs font-medium uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>El Consejo de Wilma</span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-white mb-2 leading-snug">
              {dailyTip.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              "{dailyTip.content}"
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
            <span>Edición Editorial Diaria</span>
            <span className="font-serif italic text-[#C5A059]">Por Wilma AI</span>
          </div>
        </section>
      </div>
    </div>
  );
};
