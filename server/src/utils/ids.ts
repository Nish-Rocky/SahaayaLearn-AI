import { v4 as uuidv4 } from 'uuid';

export function generateId(prefix = ''): string {
  const id = uuidv4();
  return prefix ? `${prefix}_${id.replace(/-/g, '').slice(0, 16)}` : id;
}

export function generateSessionId(): string {
  return generateId('sess');
}

export function generateQuizId(): string {
  return generateId('quiz');
}

export function generateMissionId(): string {
  return generateId('msn');
}

export function generateContentId(): string {
  return generateId('cnt');
}
