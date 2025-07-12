import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, SessionSummary } from '@/types/session';

const SESSIONS_KEY = 'counter_sessions';

export const sessionStorage = {
  async getAllSessions(): Promise<SessionSummary[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
      if (!sessionsJson) return [];
      
      const sessions: Session[] = JSON.parse(sessionsJson);
      return sessions.map(session => ({
        id: session.id,
        name: session.name,
        count: session.count,
        hasImage: !!session.image,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      }));
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  },

  async getSession(id: string): Promise<Session | null> {
    try {
      const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
      if (!sessionsJson) return null;
      
      const sessions: Session[] = JSON.parse(sessionsJson);
      return sessions.find(session => session.id === id) || null;
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  },

  async saveSession(session: Session): Promise<void> {
    try {
      const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
      const sessions: Session[] = sessionsJson ? JSON.parse(sessionsJson) : [];
      
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      if (existingIndex >= 0) {
        sessions[existingIndex] = { ...session, updatedAt: new Date().toISOString() };
      } else {
        sessions.push(session);
      }
      
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  },

  async deleteSession(id: string): Promise<void> {
    try {
      const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
      if (!sessionsJson) return;
      
      const sessions: Session[] = JSON.parse(sessionsJson);
      const filteredSessions = sessions.filter(session => session.id !== id);
      
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  },

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};