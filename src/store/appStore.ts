import { create } from "zustand";
import type { Night } from "../data/mockData";
import { generateMockData } from "../data/mockData";

export interface DemoState {
  connected: boolean;
  lowBattery: boolean;
  firstNight: boolean;
  noData: boolean;
}

export interface AppState {
  // Navigation & state
  completedOnboarding: boolean;
  currentScreen: string;
  nights: Night[];
  demoState: DemoState;

  // UI state
  selectedDate?: string;
  syncLoading: boolean;
  lastSyncTime: string;

  // Usability log
  events: Array<{ timestamp: number; event: string; screen?: string }>;
  homeViewFirstTime?: number;
  fixesOpenTime?: number;

  // Actions
  setCompletedOnboarding: (completed: boolean) => void;
  setCurrentScreen: (screen: string) => void;
  setDemoState: (state: Partial<DemoState>) => void;
  setSyncLoading: (loading: boolean) => void;
  updateNightPainRating: (date: string, rating: number) => void;
  updateFixCompleted: (date: string, fixId: string, completed: boolean) => void;
  setFixReminderTime: (date: string, fixId: string, time: string) => void;
  logEvent: (event: string, screen?: string) => void;
  recordHomeViewTime: () => void;
  recordFixesOpenTime: () => void;
  getEvents: () => Array<{ timestamp: number; event: string; screen?: string }>,
  reset: () => void;
}

const STORAGE_KEY = "smartpillow";

function loadState(): Partial<AppState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        completedOnboarding: parsed.completedOnboarding || false,
        currentScreen: parsed.currentScreen || "home",
        nights: parsed.nights || generateMockData(),
        demoState: parsed.demoState || {
          connected: true,
          lowBattery: false,
          firstNight: false,
          noData: false,
        },
        syncLoading: false,
        lastSyncTime: parsed.lastSyncTime || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        events: parsed.events || [],
        homeViewFirstTime: parsed.homeViewFirstTime,
        fixesOpenTime: parsed.fixesOpenTime,
      };
    }
  } catch (e) {
    console.error("Failed to load state:", e);
  }
  return {
    completedOnboarding: false,
    currentScreen: "home",
    nights: generateMockData(),
    demoState: {
      connected: true,
      lowBattery: false,
      firstNight: false,
      noData: false,
    },
    syncLoading: false,
    lastSyncTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    events: [],
  };
}

function saveState(state: Partial<AppState>) {
  try {
    const toSave = {
      completedOnboarding: state.completedOnboarding,
      currentScreen: state.currentScreen,
      nights: state.nights,
      demoState: state.demoState,
      lastSyncTime: state.lastSyncTime,
      events: state.events,
      homeViewFirstTime: state.homeViewFirstTime,
      fixesOpenTime: state.fixesOpenTime,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
}

export const useAppStore = create<AppState>((set, get) => {
  const initialState = loadState() as AppState;

  return {
    ...initialState,

    setCompletedOnboarding: (completed) => {
      set((state) => {
        const updated = { ...state, completedOnboarding: completed };
        saveState(updated);
        return updated;
      });
    },

    setCurrentScreen: (screen) => {
      set((state) => {
        const updated = { ...state, currentScreen: screen };
        saveState(updated);
        return updated;
      });
    },

    setDemoState: (demoUpdate) => {
      set((state) => {
        const updated = {
          ...state,
          demoState: { ...state.demoState, ...demoUpdate },
        };
        saveState(updated);
        return updated;
      });
    },

    setSyncLoading: (loading) => {
      set({ syncLoading: loading });
    },

    updateNightPainRating: (date, rating) => {
      set((state) => {
        const nights = state.nights.map((n) =>
          n.date === date ? { ...n, morningPainRating: rating } : n
        );
        const updated = { ...state, nights };
        saveState(updated);
        return updated;
      });
    },

    updateFixCompleted: (date, fixId, completed) => {
      set((state) => {
        const nights = state.nights.map((n) =>
          n.date === date
            ? {
                ...n,
                fixes: n.fixes.map((f) =>
                  f.id === fixId ? { ...f, completed } : f
                ),
              }
            : n
        );
        const updated = { ...state, nights };
        saveState(updated);
        return updated;
      });
    },

    setFixReminderTime: (date, fixId, time) => {
      set((state) => {
        const nights = state.nights.map((n) =>
          n.date === date
            ? {
                ...n,
                fixes: n.fixes.map((f) =>
                  f.id === fixId ? { ...f, reminderTime: time } : f
                ),
              }
            : n
        );
        const updated = { ...state, nights };
        saveState(updated);
        return updated;
      });
    },

    logEvent: (event, screen) => {
      set((state) => {
        const newEvent = {
          timestamp: Date.now(),
          event,
          screen,
        };
        const updated = {
          ...state,
          events: [...state.events, newEvent],
        };
        saveState(updated);
        return updated;
      });
    },

    recordHomeViewTime: () => {
      set((state) => {
        if (!state.homeViewFirstTime) {
          const updated = {
            ...state,
            homeViewFirstTime: Date.now(),
          };
          saveState(updated);
          return updated;
        }
        return state;
      });
    },

    recordFixesOpenTime: () => {
      set((state) => {
        const now = Date.now();
        if (state.homeViewFirstTime && !state.fixesOpenTime) {
          const timeToOpen = now - state.homeViewFirstTime;
          const updated = {
            ...state,
            fixesOpenTime: now,
            events: [
              ...state.events,
              {
                timestamp: now,
                event: `Time to open fixes: ${timeToOpen}ms`,
                screen: "home",
              },
            ],
          };
          saveState(updated);
          return updated;
        }
        return state;
      });
    },

    getEvents: () => {
      return get().events;
    },

    reset: () => {
      const reset = {
        completedOnboarding: false,
        currentScreen: "onboarding",
        nights: generateMockData(),
        demoState: {
          connected: true,
          lowBattery: false,
          firstNight: false,
          noData: false,
        },
        syncLoading: false,
        lastSyncTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        events: [],
        homeViewFirstTime: undefined,
        fixesOpenTime: undefined,
      };
      saveState(reset);
      set(reset);
    },
  };
});
