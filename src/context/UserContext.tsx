import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---
export interface DictionaryItem {
  id: string; // Could be word itself if unique
  korean: string;
  turkish: string;
  type?: string;
}

export interface SRSItem {
  id: string;
  box: number; // 0 to 5 (0 is new, 5 is learned)
  nextReviewDate: string; // ISO date string
}

export interface UserState {
  xp: number;
  streak: number;
  lastLoginDate: string;
  completedLessons: string[]; // array of lesson IDs
  myDictionary: DictionaryItem[];
  srsDeck: Record<string, SRSItem>; // map of vocabulary ID to SRS status
}

const initialState: UserState = {
  xp: 0,
  streak: 0,
  lastLoginDate: new Date().toISOString().split('T')[0],
  completedLessons: [],
  myDictionary: [],
  srsDeck: {}
};

interface UserContextType {
  state: UserState;
  addXP: (amount: number) => void;
  markLessonComplete: (lessonId: string) => void;
  toggleDictionaryItem: (item: DictionaryItem) => void;
  updateSRS: (itemId: string, correct: boolean) => void;
  checkStreak: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'korean_app_user_data';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...initialState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not load user data", e);
    }
    return initialState;
  });

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const checkStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      // Very basic streak logic
      if (prev.lastLoginDate === today) return prev; // Already logged in today

      const lastLogin = new Date(prev.lastLoginDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Came back exactly the next day
        return { ...prev, streak: prev.streak + 1, lastLoginDate: today };
      } else if (diffDays > 1) {
        // Missed a day
        return { ...prev, streak: 1, lastLoginDate: today };
      }
      
      return { ...prev, lastLoginDate: today };
    });
  };

  // Check login streak once on mount
  useEffect(() => {
    checkStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addXP = (amount: number) => {
    setState(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const markLessonComplete = (lessonId: string) => {
    setState(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId]
      };
    });
  };

  const toggleDictionaryItem = (item: DictionaryItem) => {
    setState(prev => {
      const exists = prev.myDictionary.some(i => i.id === item.id);
      if (exists) {
        return {
          ...prev,
          myDictionary: prev.myDictionary.filter(i => i.id !== item.id)
        };
      }
      return {
        ...prev,
        myDictionary: [...prev.myDictionary, item]
      };
    });
  };

  const updateSRS = (itemId: string, correct: boolean) => {
    setState(prev => {
      const current = prev.srsDeck[itemId] || { id: itemId, box: 0, nextReviewDate: new Date().toISOString() };
      
      let newBox = correct ? current.box + 1 : 0;
      if (newBox > 5) newBox = 5;

      // Intervals: box 1: 1 day, box 2: 3 days, box 3: 7 days, box 4: 14 days, box 5: 30 days
      const intervals = [0, 1, 3, 7, 14, 30];
      const daysToAdd = intervals[newBox] || 0;
      
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + daysToAdd);

      return {
        ...prev,
        srsDeck: {
          ...prev.srsDeck,
          [itemId]: {
            ...current,
            box: newBox,
            nextReviewDate: nextDate.toISOString()
          }
        }
      };
    });
  };

  return (
    <UserContext.Provider value={{ state, addXP, markLessonComplete, toggleDictionaryItem, updateSRS, checkStreak }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
