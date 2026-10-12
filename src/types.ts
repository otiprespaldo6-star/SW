export type ColorSeason =
  | 'Otoño Cálido'
  | 'Otoño Suave'
  | 'Otoño Oscuro'
  | 'Primavera Brillante'
  | 'Primavera Clara'
  | 'Primavera Cálida'
  | 'Verano Suave'
  | 'Verano Claro'
  | 'Verano Frío'
  | 'Invierno Brillante'
  | 'Invierno Frío'
  | 'Invierno Oscuro';

export type BodySilhouette =
  | 'Reloj de Arena'
  | 'Rectángulo'
  | 'Triángulo (Pera)'
  | 'Triángulo Invertido'
  | 'Óvalo (Manzana)';

export interface ColorDNA {
  season: ColorSeason;
  temperature: 'Cálida' | 'Fría' | 'Neutra cálida' | 'Neutra fría';
  depth: 'Clara' | 'Media' | 'Profunda';
  intensity: 'Brillante' | 'Suave' | 'Media';
  contrast: 'Bajo' | 'Medio' | 'Alto';
  palette: Array<{ name: string; hex: string }>;
  neutrals: Array<{ name: string; hex: string }>;
  metals: string[];
  colorsToAvoid: string[];
}

export interface BodyDNA {
  silhouette: BodySilhouette;
  proportions: {
    shoulders: 'Estrechos' | 'Equilibrados' | 'Anchos';
    waist: 'Muy definida' | 'Suavemente definida' | 'Poco definida';
    hips: 'Estrechas' | 'Equilibradas' | 'Pronunciadas';
    torsoRatio: 'Torso largo / Piernas cortas' | 'Equilibrado' | 'Torso corto / Piernas largas';
  };
  featuresToHighlight: string[];
  featuresToModerate: string[];
  recommendedLengths: string[];
  recommendedNecklines: string[];
}

export interface StyleDNAArchetype {
  primary: string;
  percentages: {
    classic: number;
    natural: number;
    romantic: number;
    creative: number;
  };
  keyElements: string[];
  styleMotto: string;
}

export interface LifestyleDNA {
  ageGroup: string;
  profession: string;
  workMode: 'Presencial' | 'Híbrido' | '100% Remoto' | 'Itinerante';
  routineDescription: string;
  typicalEvents: string[];
  climate: string;
}

export interface ComfortDNA {
  priorityScore: number; // 1-10
  preferredFit: 'Estructurado' | 'Semi-ajustado' | 'Fluido' | 'Oversize relajado';
  maxHeelHeight: string;
  mobilityNeeds: string;
  rejectedGarments: string[];
  favoriteFabrics: string[];
}

export interface ShoppingDNA {
  budgetTier: 'Accesible' | 'Medio-Elevado' | 'Lujo Silencioso / Inversión';
  shoppingFrequency: 'Mensual' | 'Por temporada' | 'Compras cápsula meditadas';
  favoriteBrands: string[];
  investmentPriorities: string[];
  commonFrustrations: string[];
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'bags' | 'accessories';
  colorName: string;
  colorHex: string;
  occasion: 'Trabajo' | 'Casual' | 'Cena/Noche' | 'Eventos' | 'Versátil';
  imageUrl: string;
  tags: string[];
  notes?: string;
  createdAt: string;
}

export type OutfitOccasion = 'Trabajo' | 'Casual' | 'Cena/Noche' | 'Eventos' | 'Reunión Importante' | 'Viaje' | 'Fin de Semana';

export interface PlannedOutfit {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  occasion: OutfitOccasion;
  weather?: {
    temp: string;
    condition: string;
  };
  itemIds: string[];
  items?: WardrobeItem[];
  notes?: string;
  aiStylistAdvice?: string;
  status: 'planned' | 'worn' | 'skipped';
  rating?: number; // 1 to 5 stars
  feedbackNotes?: string;
  loggedAt?: string;
}

export interface SchedulingHabits {
  mostWornCategories: Array<{ category: string; count: number; percentage: number }>;
  favoriteOccasions: Array<{ occasion: string; count: number }>;
  weeklyRotationScore: number; // 0-100
  favoriteColorAccents: string[];
  identifiedPatterns: string[];
  wilmaLearningSummary: string;
  lastLearnedAt: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  isOnboarded: boolean;
  colorDna: ColorDNA;
  bodyDna: BodyDNA;
  styleDna: StyleDNAArchetype;
  lifestyleDna: LifestyleDNA;
  comfortDna: ComfortDNA;
  shoppingDna: ShoppingDNA;
  wardrobe: WardrobeItem[];
  outfitCalendar: PlannedOutfit[];
  schedulingHabits?: SchedulingHabits;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'wilma';
  text: string;
  timestamp: string;
  contextTag?: string;
}

export interface LookCheckResult {
  score: number;
  verdict: string;
  harmonyAnalysis: {
    color: string;
    proportions: string;
    styleCoherence: string;
    occasionFit: string;
  };
  wilmaTweaks: string[];
  recommendedAccessories: string[];
}

export interface BuyCheckResult {
  score: number;
  verdict: '¡Cómpralo sin dudar!' | 'Piénsalo 24 horas' | 'Mejor déjalo pasar';
  colorAnalysis: string;
  bodyFitAnalysis: string;
  styleAlignment: string;
  wardrobePairings: string[];
  pricePerWearVerdict: string;
  stylistTip: string;
}

export interface ColorCheckResult {
  matchStatus: 'Color Estrella' | 'Favorecedor' | 'Neutro Armonioso' | 'Color Desafiante';
  explanation: string;
  howToWearTip: string;
  bestPairings: string[];
}

export interface UserAccount {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  emailOrPhone: string;
  birthDate?: {
    day: string;
    month: string;
    year: string;
  };
  gender?: 'Femenino' | 'Masculino' | 'Personalizado' | 'Prefiero no decir';
  role: 'user' | 'superadmin';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin: string;
  avatar?: string;
  colorSeason?: ColorSeason;
  styleArchetype?: string;
  wardrobeCount: number;
  authProvider: 'email' | 'google' | 'master';
}

export interface AdminMetrics {
  totalUsers: number;
  activeUsersToday: number;
  monthlyActiveUsers: number;
  onboardingCompletionRate: number;
  totalAiConsultations: number;
  totalLooksAnalyzed: number;
  totalPurchaseChecks: number;
  totalColorChecks: number;
  totalWardrobeItems: number;
  colorSeasonDistribution: Array<{
    season: string;
    count: number;
    percentage: number;
    hex: string;
  }>;
  bodySilhouetteDistribution: Array<{
    silhouette: string;
    count: number;
    percentage: number;
  }>;
  styleArchetypeDistribution: Array<{
    archetype: string;
    percentage: number;
  }>;
  topBrands: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    user: string;
    action: string;
    time: string;
    tag: 'signup' | 'stylecheck' | 'purchase' | 'chat' | 'admin' | 'recovery';
  }>;
  systemHealth: {
    status: 'optimal' | 'degraded' | 'maintenance';
    uptime: string;
    geminiStatus: string;
    latencyMs: number;
    activeSessions: number;
  };
}

