import { InterviewSession } from '../types';
import { clearAllRecordedVideos } from './videoStorage';

const STORAGE_KEY = 'interviewiq_sessions_v2_real';

export function getInterviewSessions(): InterviewSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error('Failed to parse interview sessions from storage', err);
    return [];
  }
}

export function saveInterviewSession(session: InterviewSession): void {
  try {
    const current = getInterviewSessions();
    const updated = [session, ...current.filter(s => s.id !== session.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save interview session', err);
  }
}

export function getInterviewSessionById(id: string): InterviewSession | null {
  const sessions = getInterviewSessions();
  return sessions.find(s => s.id === id) || null;
}

export function deleteInterviewSession(id: string): void {
  try {
    const current = getInterviewSessions();
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete interview session', err);
  }
}

export function clearAllSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    clearAllRecordedVideos();
  } catch (err) {
    console.error('Failed to clear sessions', err);
  }
}
