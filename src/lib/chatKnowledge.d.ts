export const WELCOME_MESSAGE: string

export type QuickAction = {
  label: string
  value: string
}

export const QUICK_ACTIONS: QuickAction[]

export function getTimeGreeting(date?: Date): string

export function getWelcomeMessage(date?: Date): string

export function getUserNameFromHistory(
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
): string | null

export function getChatResponse(
  text: string,
  history?: Array<{ role: 'user' | 'assistant'; content: string; currentMenuCategory?: string | null }>,
  lang?: string,
  currentMenuCategory?: string | null,
): Promise<string | { response: string; currentMenuCategory: string | null }>
