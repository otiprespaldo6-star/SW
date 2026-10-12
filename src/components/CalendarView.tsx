import React, { useState } from 'react';
import { UserProfile, PlannedOutfit, WardrobeItem, OutfitOccasion, SchedulingHabits } from '../types';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/geminiService';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  CheckCircle2,
  Star,
  Clock,
  Trash2,
  RefreshCw,
  Edit3,
  Sun,
  CloudSun,
  CloudRain,
  Heart,
  TrendingUp,
  Tag,
  X,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CalendarViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateToChatWithPrompt?: (prompt: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToChatWithPrompt,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda' | 'habits'>('calendar');

  // Modals
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planMode, setPlanMode] = useState<'ai' | 'manual'>('ai');
  const [isLogWornModalOpen, setIsLogWornModalOpen] = useState(false);
  const [isAnalyzingHabits, setIsAnalyzingHabits] = useState(false);
  const [isAiGeneratingOutfit, setIsAiGeneratingOutfit] = useState(false);

  // Form State for planning
  const [eventTitle, setEventTitle] = useState('');
  const [eventOccasion, setEventOccasion] = useState<OutfitOccasion>('Trabajo');
  const [eventWeather, setEventWeather] = useState('20°C, Agradable');
  const [eventNotes, setEventNotes] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [manualCategoryFilter, setManualCategoryFilter] = useState<string>('all');

  // Form state for logging worn outfit
  const [ratingStars, setRatingStars] = useState(5);
  const [feelingFeedback, setFeelingFeedback] = useState('Me sentí cómoda, estilizada y con la energía adecuada.');

  // Current month calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDay = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Find outfit for selected date
  const selectedOutfit = (profile.outfitCalendar || []).find((p) => p.date === selectedDateStr);

  // Helper to get wardrobe item details
  const getItemsForOutfit = (itemIds: string[]): WardrobeItem[] => {
    return (profile.wardrobe || []).filter((w) => itemIds.includes(w.id));
  };

  // Open planning modal
  const handleOpenPlanModal = (mode: 'ai' | 'manual') => {
    setPlanMode(mode);
    setEventTitle('');
    setEventOccasion('Trabajo');
    setEventNotes('');
    setSelectedItemIds([]);
    setIsPlanModalOpen(true);
  };

  // AI-driven outfit planner for chosen date
  const handleGenerateAiOutfit = async () => {
    if (!eventTitle.trim()) {
      alert('Por favor ingresa el nombre del evento o actividad.');
      return;
    }

    setIsAiGeneratingOutfit(true);
    try {
      const result = await GeminiService.planOutfitWithWilma(
        selectedDateStr,
        eventTitle.trim(),
        eventOccasion,
        eventWeather,
        profile
      );

      const newOutfit: PlannedOutfit = {
        id: `plan-${Date.now()}`,
        date: selectedDateStr,
        title: result.title,
        occasion: eventOccasion,
        weather: { temp: eventWeather.split(',')[0] || '20°C', condition: eventWeather.split(',')[1] || 'Templado' },
        itemIds: result.itemIds,
        notes: eventNotes,
        aiStylistAdvice: result.advice,
        status: 'planned',
      };

      const updated = StorageService.addPlannedOutfit(newOutfit);
      onUpdateProfile(updated);
      setIsPlanModalOpen(false);
    } catch (e) {
      console.error('Error planning outfit with AI', e);
    } finally {
      setIsAiGeneratingOutfit(false);
    }
  };

  // Manual save outfit
  const handleSaveManualOutfit = () => {
    if (!eventTitle.trim()) {
      alert('Por favor ingresa el nombre del evento.');
      return;
    }
    if (selectedItemIds.length === 0) {
      alert('Selecciona al menos una prenda de tu armario.');
      return;
    }

    const newOutfit: PlannedOutfit = {
      id: `plan-${Date.now()}`,
      date: selectedDateStr,
      title: eventTitle.trim(),
      occasion: eventOccasion,
      weather: { temp: eventWeather.split(',')[0] || '20°C', condition: eventWeather.split(',')[1] || 'Agradable' },
      itemIds: selectedItemIds,
      notes: eventNotes,
      aiStylistAdvice: `Combinación personalizada creada por ti. Respeta tu paleta de ${profile.colorDna.season} y responde a tu ocasión de ${eventOccasion}.`,
      status: 'planned',
    };

    const updated = StorageService.addPlannedOutfit(newOutfit);
    onUpdateProfile(updated);
    setIsPlanModalOpen(false);
  };

  // Toggle item in manual picker
  const toggleItemSelection = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  // Delete outfit
  const handleDeleteOutfit = (outfitId: string) => {
    if (confirm('¿Deseas eliminar este look planificado de tu calendario?')) {
      const updated = StorageService.deletePlannedOutfit(outfitId);
      onUpdateProfile(updated);
    }
  };

  // Save Worn Log
  const handleSaveWornLog = () => {
    if (!selectedOutfit) return;
    const updated = StorageService.logOutfitAsWorn(selectedOutfit.id, ratingStars, feelingFeedback);
    onUpdateProfile(updated);
    setIsLogWornModalOpen(false);
  };

  // Run AI analysis of scheduling habits
  const handleAnalyzeHabits = async () => {
    setIsAnalyzingHabits(true);
    try {
      const result = await GeminiService.analyzeSchedulingHabits(profile);
      const updatedHabits: SchedulingHabits = {
        ...profile.schedulingHabits!,
        weeklyRotationScore: result.weeklyRotationScore,
        wilmaLearningSummary: result.wilmaLearningSummary,
        identifiedPatterns: result.identifiedPatterns,
        lastLearnedAt: new Date().toISOString().split('T')[0],
      };
      const updatedProfile = StorageService.updateSchedulingHabits(updatedHabits);
      onUpdateProfile(updatedProfile);
    } catch (e) {
      console.error('Error analyzing habits', e);
    } finally {
      setIsAnalyzingHabits(false);
    }
  };

  // Stats calculation
  const totalPlanned = (profile.outfitCalendar || []).length;
  const totalWorn = (profile.outfitCalendar || []).filter((p) => p.status === 'worn').length;
  const habits = profile.schedulingHabits;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Header */}
      <section className="bg-gradient-to-r from-[#F4EFE6] via-[#FAF6F0] to-[#FBF9F5] p-5 rounded-3xl border border-[#E9DEC9] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1917] text-[#EAE3D9] text-[11px] font-medium tracking-wide mb-2">
              <CalendarIcon className="w-3 h-3 text-[#C5A059]" />
              <span>Agenda Inteligente de Looks · Aprendizaje IA</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917]">
              Calendario de Outfits
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Planifica tus looks con antelación o regístralos al vestirte. Wilma aprende tus hábitos semanales, rotación de prendas y nivel de confort real.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-[#EBE1D0] text-center min-w-[85px]">
              <span className="block text-lg font-bold text-[#1C1917] font-serif leading-none">
                {totalPlanned}
              </span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">
                Looks en Agenda
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-[#EBE1D0] text-center min-w-[85px]">
              <span className="block text-lg font-bold text-[#C86D51] font-serif leading-none">
                {habits?.weeklyRotationScore || 88}%
              </span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">
                Rotación Óptima
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#E8DEC9]/60">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'bg-white/60 text-stone-600 hover:bg-white hover:text-stone-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Vista Mes</span>
          </button>

          <button
            onClick={() => setViewMode('agenda')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'agenda'
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'bg-white/60 text-stone-600 hover:bg-white hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Timeline de Looks</span>
          </button>

          <button
            onClick={() => setViewMode('habits')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'habits'
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'bg-white/60 text-stone-600 hover:bg-white hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Hábitos Aprendidos ({habits?.identifiedPatterns.length || 4})</span>
          </button>
        </div>
      </section>

      {/* ---------------- VIEW MODE 1: CALENDAR GRID ---------------- */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Box (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-[#E9DEC9] shadow-xs">
            {/* Month & Nav Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                  {monthNames[month]} {year}
                </h2>
                <button
                  onClick={goToToday}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F4EFE6] text-stone-800 hover:bg-[#EAE2D3] transition-colors"
                >
                  Hoy
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
                  title="Mes anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
                  title="Mes siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {daysOfWeek.map((d, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider py-1"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Empty leading padding */}
              {Array.from({ length: startingDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[75px] sm:min-h-[88px] rounded-2xl bg-stone-50/50 border border-transparent opacity-30" />
              ))}

              {/* Day Cells */}
              {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                const dayNum = dayIndex + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = dateStr === selectedDateStr;
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const outfit = (profile.outfitCalendar || []).find((p) => p.date === dateStr);
                const items = outfit ? getItemsForOutfit(outfit.itemIds) : [];

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`min-h-[75px] sm:min-h-[92px] p-1.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm ring-2 ring-[#C5A059]/40'
                        : outfit
                        ? 'border-[#E8DEC9] bg-[#FAF8F5] hover:border-stone-400'
                        : 'border-stone-200/80 bg-white hover:bg-stone-50'
                    }`}
                  >
                    {/* Header: day number and badges */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday
                            ? 'bg-[#1C1917] text-white'
                            : isSelected
                            ? 'bg-[#C5A059] text-white'
                            : 'text-stone-700'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {outfit && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            outfit.status === 'worn'
                              ? 'bg-emerald-500'
                              : 'bg-[#C86D51]'
                          }`}
                          title={outfit.status === 'worn' ? 'Look Usado' : 'Look Planificado'}
                        />
                      )}
                    </div>

                    {/* Outfit thumbnail preview in calendar cell */}
                    {outfit ? (
                      <div className="w-full mt-1">
                        <div className="flex -space-x-2 overflow-hidden py-0.5">
                          {items.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-white shadow-2xs"
                            />
                          ))}
                        </div>
                        <span className="block truncate text-[10px] font-medium text-stone-800 leading-tight mt-0.5">
                          {outfit.title}
                        </span>
                      </div>
                    ) : (
                      <div className="h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Detail Inspector (5 cols on lg) */}
          <div className="lg:col-span-5 bg-[#FAF8F5] p-5 rounded-3xl border border-[#E9DEC9] flex flex-col justify-between shadow-xs">
            <div>
              {/* Header of selected day */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC9]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C86D51]">
                    Día Seleccionado
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                    {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </h3>
                </div>

                {selectedOutfit ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenPlanModal('manual')}
                      className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/50"
                      title="Editar prendas"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOutfit(selectedOutfit.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                      title="Eliminar de la agenda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Outfit Content or Empty State */}
              {selectedOutfit ? (
                <div className="space-y-4 pt-4">
                  {/* Title & Occasion badge */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#1C1917] text-white">
                        {selectedOutfit.occasion}
                      </span>
                      {selectedOutfit.status === 'worn' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Usado ({selectedOutfit.rating}★)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>Planificado</span>
                        </span>
                      )}
                      {selectedOutfit.weather && (
                        <span className="text-[11px] text-stone-500 ml-auto">
                          ☀️ {selectedOutfit.weather.temp}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                      {selectedOutfit.title}
                    </h4>
                    {selectedOutfit.notes && (
                      <p className="text-xs text-stone-500 italic mt-0.5">
                        "{selectedOutfit.notes}"
                      </p>
                    )}
                  </div>

                  {/* Garments Visual Showcase */}
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-2">
                      Prendas del Armario ({selectedOutfit.itemIds.length})
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {getItemsForOutfit(selectedOutfit.itemIds).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EAE2D3] shadow-2xs"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="block text-xs font-semibold text-stone-900 truncate">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-stone-300"
                                style={{ backgroundColor: item.colorHex }}
                              />
                              <span className="text-[10px] text-stone-500 truncate">
                                {item.colorName}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wilma's Editorial Stylist Advice */}
                  {selectedOutfit.aiStylistAdvice && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F4EFE6] to-[#FAF6F0] border border-[#E5DAC6] relative">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C5A059] mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Consejo de Estilo de Wilma</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed font-sans">
                        {selectedOutfit.aiStylistAdvice}
                      </p>
                    </div>
                  )}

                  {/* Feedback notes if worn */}
                  {selectedOutfit.status === 'worn' && selectedOutfit.feedbackNotes && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900">
                      <span className="font-semibold block text-[11px]">Tu valoración real:</span>
                      <p className="italic mt-0.5">"{selectedOutfit.feedbackNotes}"</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty state: No outfit yet for this date */
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFE8DC] text-[#C86D51] flex items-center justify-center mx-auto">
                    <CalendarIcon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900">
                      Sin look asignado
                    </h4>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                      ¿Qué tienes planeado este día? Deja que Wilma elija de tu armario o combina manualmente.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions for Selected Date */}
            <div className="pt-4 mt-4 border-t border-[#E8DEC9] space-y-2">
              {selectedOutfit ? (
                <>
                  {selectedOutfit.status !== 'worn' ? (
                    <button
                      onClick={() => setIsLogWornModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1C1917] text-white hover:bg-stone-900 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Registrar como Usado Hoy & Calificar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsLogWornModalOpen(true)}
                      className="w-full py-2 px-4 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Editar valoración ({selectedOutfit.rating}★)</span>
                    </button>
                  )}
                  {onNavigateToChatWithPrompt && (
                    <button
                      onClick={() =>
                        onNavigateToChatWithPrompt(
                          `Tengo planificado para el ${selectedOutfit.date} el look "${selectedOutfit.title}" (${selectedOutfit.occasion}). ¿Cómo puedo elevarlo con mis accesorios de oro y maquillaje?`
                        )
                      }
                      className="w-full py-2 px-3 rounded-xl bg-transparent hover:bg-white text-stone-600 hover:text-stone-900 text-[11px] font-semibold text-center transition-colors"
                    >
                      💬 Consultar detalles de este look en el Chat con Wilma
                    </button>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenPlanModal('ai')}
                    className="py-2.5 px-3 rounded-xl bg-[#1C1917] text-[#C5A059] hover:bg-black text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Planificar con Wilma (IA)</span>
                  </button>

                  <button
                    onClick={() => handleOpenPlanModal('manual')}
                    className="py-2.5 px-3 rounded-xl bg-white border border-[#DCD0BE] text-stone-800 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-stone-600" />
                    <span>Elegir de mi Armario</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- VIEW MODE 2: TIMELINE AGENDA ---------------- */}
      {viewMode === 'agenda' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Próximos Looks & Registro Cronológico
            </h2>
            <button
              onClick={() => handleOpenPlanModal('ai')}
              className="px-3 py-1.5 rounded-xl bg-[#1C1917] text-white hover:bg-stone-900 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Nuevo Look</span>
            </button>
          </div>

          <div className="space-y-3">
            {[...(profile.outfitCalendar || [])]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((outfit) => {
                const isSelected = outfit.date === selectedDateStr;
                const items = getItemsForOutfit(outfit.itemIds);
                const isToday = outfit.date === new Date().toISOString().split('T')[0];

                return (
                  <div
                    key={outfit.id}
                    onClick={() => {
                      setSelectedDateStr(outfit.date);
                      setViewMode('calendar');
                    }}
                    className={`p-4 rounded-3xl border bg-white cursor-pointer hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isToday
                        ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20'
                        : isSelected
                        ? 'border-[#1C1917]'
                        : 'border-[#EAE0D0]'
                    }`}
                  >
                    {/* Left: Date & Title */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] border border-[#E2D5BF] flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold uppercase text-[#C86D51]">
                          {new Date(outfit.date + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short' })}
                        </span>
                        <span className="font-serif text-base font-bold text-stone-900 leading-none">
                          {outfit.date.split('-')[2]}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1C1917] text-white">
                            {outfit.occasion}
                          </span>
                          {outfit.status === 'worn' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Usado ({outfit.rating}★)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Planificado</span>
                            </span>
                          )}
                          {isToday && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059] text-white">
                              HOY
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                          {outfit.title}
                        </h3>
                        {outfit.aiStylistAdvice && (
                          <p className="text-xs text-stone-600 line-clamp-1 max-w-lg mt-0.5">
                            {outfit.aiStylistAdvice}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Garment Thumbnails */}
                    <div className="flex items-center gap-2 shrink-0 overflow-x-auto py-1">
                      {items.map((item) => (
                        <div key={item.id} className="relative group/thumb">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E5DAC6] shadow-2xs"
                          />
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] truncate px-1 rounded-b-xl text-center">
                            {item.colorName.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ---------------- VIEW MODE 3: AI HABITS & LEARNING ---------------- */}
      {viewMode === 'habits' && (
        <div className="space-y-6">
          {/* Main AI Habit Brain Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1C1917] to-[#2B2623] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#E7CF9B] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cerebro de Aprendizaje de Wilma</span>
                </div>

                <button
                  onClick={handleAnalyzeHabits}
                  disabled={isAnalyzingHabits}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingHabits ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingHabits ? 'Analizando...' : 'Recalcular Diagnóstico'}</span>
                </button>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#FAF7F2]">
                  Cómo Viste {profile.name} en su Vida Real
                </h2>
                <p className="text-sm text-stone-300 font-sans leading-relaxed mt-2 max-w-3xl">
                  {habits?.wilmaLearningSummary}
                </p>
              </div>

              {/* Progress Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-stone-400 block font-medium">Rotación de Armario</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-[#E7CF9B] font-serif">
                      {habits?.weeklyRotationScore}%
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">Excelente</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#C5A059] h-full rounded-full"
                      style={{ width: `${habits?.weeklyRotationScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-stone-400 block font-medium">Fidelidad a Paleta</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-white font-serif">96%</span>
                    <span className="text-[11px] text-stone-300">{profile.colorDna.season}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#C86D51] h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-stone-400 block font-medium">Confort Reportado</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-emerald-400 font-serif">4.9/5</span>
                    <span className="text-[11px] text-stone-300">Calzado & Caída</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Identified Habit Patterns Cards */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-3">
              Patrones de Comportamiento Identificados
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {habits?.identifiedPatterns.map((pattern, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#E9DEC9] shadow-2xs flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F4EFE6] text-[#C86D51] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {pattern}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Usage Frequency Chart */}
          <div className="bg-white p-5 rounded-3xl border border-[#E9DEC9]">
            <h3 className="font-serif text-base font-bold text-[#1C1917] mb-4">
              Prendas Más Reincidentes en la Agenda de {profile.name}
            </h3>

            <div className="space-y-3">
              {habits?.mostWornCategories.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800">{cat.category}</span>
                    <span className="text-stone-500 font-medium">
                      {cat.count} veces ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F4EFE6] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1C1917] h-full rounded-full"
                      style={{ width: `${cat.percentage * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 1: PLAN OUTFIT (AI OR MANUAL) ---------------- */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FBF9F5] w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl border border-[#E8DEC9] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E8DEC9] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#C5A059] flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1C1917]">
                    Planificar Look para el {selectedDateStr}
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    {planMode === 'ai' ? 'Asesoría impulsada por Gemini' : 'Selección de tu armario digital'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Event Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre del Evento o Actividad *
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="ej. Comité con Dirección, Cena de Aniversario, Viernes Casual"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>

              {/* Occasion & Weather */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ocasión
                  </label>
                  <select
                    value={eventOccasion}
                    onChange={(e) => setEventOccasion(e.target.value as OutfitOccasion)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-[#C5A059]"
                  >
                    <option value="Trabajo">Trabajo</option>
                    <option value="Reunión Importante">Reunión Importante</option>
                    <option value="Casual">Casual</option>
                    <option value="Cena/Noche">Cena / Noche</option>
                    <option value="Eventos">Eventos / Gala</option>
                    <option value="Viaje">Viaje</option>
                    <option value="Fin de Semana">Fin de Semana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Clima / Temperatura
                  </label>
                  <input
                    type="text"
                    value={eventWeather}
                    onChange={(e) => setEventWeather(e.target.value)}
                    placeholder="ej. 21°C, Soleado"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notas adicionales para Wilma
                </label>
                <input
                  type="text"
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  placeholder="ej. Tengo que caminar 20 min, o aire acondicionado fuerte"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>

              {/* Mode Specific: Manual Wardrobe Picker */}
              {planMode === 'manual' && (
                <div className="pt-2 border-t border-[#E8DEC9]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-stone-700">
                      Selecciona prendas de tu armario ({selectedItemIds.length} seleccionadas)
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {(profile.wardrobe || []).map((item) => {
                      const isSelected = selectedItemIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleItemSelection(item.id)}
                          className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#1C1917] bg-[#F4EFE6] ring-1 ring-[#1C1917]'
                              : 'border-stone-200 bg-white hover:border-stone-300'
                          }`}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="block text-xs font-semibold text-stone-900 truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-stone-500 block truncate">
                              {item.colorName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8DEC9] bg-white flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancelar
              </button>

              {planMode === 'ai' ? (
                <button
                  onClick={handleGenerateAiOutfit}
                  disabled={isAiGeneratingOutfit}
                  className="px-5 py-2.5 rounded-xl bg-[#1C1917] text-[#C5A059] hover:bg-black text-xs font-bold flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiGeneratingOutfit ? 'animate-spin' : ''}`} />
                  <span>{isAiGeneratingOutfit ? 'Creando con Wilma...' : 'Diseñar Look con IA'}</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveManualOutfit}
                  className="px-5 py-2.5 rounded-xl bg-[#1C1917] text-white hover:bg-stone-900 text-xs font-bold shadow-xs"
                >
                  Guardar en Agenda
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: LOG WORN OUTFIT & RATING ---------------- */}
      {isLogWornModalOpen && selectedOutfit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FBF9F5] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-[#E8DEC9] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DEC9] pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C86D51]">
                  Retroalimentación de Estilo
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  ¿Cómo te sentiste hoy con este look?
                </h3>
              </div>
              <button onClick={() => setIsLogWornModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div className="text-center py-2">
              <span className="text-xs text-stone-600 block mb-2 font-medium">
                Califica tu nivel de seguridad y confort:
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRatingStars(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= ratingStars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-800 block mt-1">
                {ratingStars === 5
                  ? '¡Impecable! 100% segura y cómoda'
                  : ratingStars === 4
                  ? 'Muy buen conjunto'
                  : ratingStars === 3
                  ? 'Aceptable con algún ajuste'
                  : 'Incómodo o poco favorecedor'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Comentarios para el aprendizaje de Wilma
              </label>
              <textarea
                rows={3}
                value={feelingFeedback}
                onChange={(e) => setFeelingFeedback(e.target.value)}
                placeholder="ej. Los mocasines fueron perfectos para caminar, pero el blazer me dio algo de calor por la tarde..."
                className="w-full p-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-[#C5A059]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsLogWornModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveWornLog}
                className="px-5 py-2.5 rounded-xl bg-[#1C1917] text-white hover:bg-stone-900 text-xs font-bold shadow-xs"
              >
                Guardar en Mi Historial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
