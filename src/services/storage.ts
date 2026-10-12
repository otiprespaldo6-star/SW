import { UserProfile, WardrobeItem, ChatMessage, PlannedOutfit, SchedulingHabits } from '../types';
import { INITIAL_USER_PROFILE } from '../data/defaultStyleDna';

const STORAGE_KEYS = {
  USER_PROFILE: 'styled_by_wilma_profile_v1',
  CHAT_HISTORY: 'styled_by_wilma_chat_v1',
};

export const StorageService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) {
        const parsed = JSON.parse(data);
        // Ensure outfitCalendar and schedulingHabits exist
        if (!parsed.outfitCalendar || !Array.isArray(parsed.outfitCalendar)) {
          parsed.outfitCalendar = INITIAL_USER_PROFILE.outfitCalendar;
        }
        if (!parsed.schedulingHabits) {
          parsed.schedulingHabits = INITIAL_USER_PROFILE.schedulingHabits;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error reading profile from localStorage', e);
    }
    // Default initial profile
    this.saveProfile(INITIAL_USER_PROFILE);
    return INITIAL_USER_PROFILE;
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile to localStorage', e);
    }
  },

  resetToDefaultProfile(): UserProfile {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    this.saveProfile(INITIAL_USER_PROFILE);
    return INITIAL_USER_PROFILE;
  },

  addWardrobeItem(item: WardrobeItem): UserProfile {
    const profile = this.getProfile();
    const updatedWardrobe = [item, ...profile.wardrobe];
    const updatedProfile = { ...profile, wardrobe: updatedWardrobe };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  removeWardrobeItem(itemId: string): UserProfile {
    const profile = this.getProfile();
    const updatedWardrobe = profile.wardrobe.filter((item) => item.id !== itemId);
    // Also remove item from planned outfits if present
    const updatedCalendar = (profile.outfitCalendar || []).map((outfit) => ({
      ...outfit,
      itemIds: outfit.itemIds.filter((id) => id !== itemId),
    }));
    const updatedProfile = { ...profile, wardrobe: updatedWardrobe, outfitCalendar: updatedCalendar };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  // Calendar & Scheduling methods
  addPlannedOutfit(outfit: PlannedOutfit): UserProfile {
    const profile = this.getProfile();
    const existingIndex = profile.outfitCalendar.findIndex(
      (p) => p.id === outfit.id || p.date === outfit.date
    );
    let updatedCalendar: PlannedOutfit[];
    if (existingIndex >= 0) {
      updatedCalendar = [...profile.outfitCalendar];
      updatedCalendar[existingIndex] = outfit;
    } else {
      updatedCalendar = [outfit, ...profile.outfitCalendar].sort((a, b) => a.date.localeCompare(b.date));
    }
    const updatedProfile = { ...profile, outfitCalendar: updatedCalendar };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  updatePlannedOutfit(outfit: PlannedOutfit): UserProfile {
    const profile = this.getProfile();
    const updatedCalendar = profile.outfitCalendar.map((p) => (p.id === outfit.id ? outfit : p));
    const updatedProfile = { ...profile, outfitCalendar: updatedCalendar };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  deletePlannedOutfit(outfitId: string): UserProfile {
    const profile = this.getProfile();
    const updatedCalendar = profile.outfitCalendar.filter((p) => p.id !== outfitId);
    const updatedProfile = { ...profile, outfitCalendar: updatedCalendar };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  logOutfitAsWorn(outfitId: string, rating: number, feedbackNotes?: string): UserProfile {
    const profile = this.getProfile();
    const updatedCalendar = profile.outfitCalendar.map((p) => {
      if (p.id === outfitId) {
        return {
          ...p,
          status: 'worn' as const,
          rating,
          feedbackNotes: feedbackNotes || p.feedbackNotes,
          loggedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    const updatedProfile = { ...profile, outfitCalendar: updatedCalendar };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  updateSchedulingHabits(habits: SchedulingHabits): UserProfile {
    const profile = this.getProfile();
    const updatedProfile = { ...profile, schedulingHabits: habits };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading chat history', e);
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'wilma',
        text: '¡Hola querida! Soy Wilma, tu asesora de imagen personal. Ya tengo tu Style DNA integrado. Cuéntame: ¿qué necesitas hoy? ¿Tienes una reunión importante, una compra que estás dudando o quieres probar una nueva combinación con tu armario?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  },

  saveChatHistory(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat history', e);
    }
  },
};
