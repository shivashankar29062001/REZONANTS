export type MenuType = 'services' | 'technologies' | 'products'

export type MenuOption = {
  index: number
  label: string
}

export type ParsedMenu = {
  type: MenuType
  options: MenuOption[]
}

export type HistoryMessage = {
  role: 'user' | 'assistant'
  content: string
  currentMenuCategory?: MenuType | string | null
}

export const SERVICES_MENU: Array<{ name: string; desc: string; purpose: string; howProvided: string; capabilities: string }>
export const TECHNOLOGIES_MENU: Array<{ name: string; tagline: string; details: string; purpose: string; howUsed: string }>
export const PRODUCTS_MENU: Array<{ name: string; purpose: string; features: string; benefits: string }>

export function normalizeDigits(str: string): string
export function parseOptionIndex(raw: string): number | null
export function buildServicesMenu(): string
export function buildTechnologiesMenu(): string
export function buildProductsMenu(): string
export function parseMenuOptions(content: string): ParsedMenu | null
export function detectActiveMenu(history: HistoryMessage[], explicitCategory?: MenuType | string | null): ParsedMenu | null
export function resolveMenuReply(text: string, history: HistoryMessage[], explicitCategory?: MenuType | string | null): string | null
export function answerGeneralKnowledge(text: string): string | null
export function tryMathCalculation(text: string): string | null
