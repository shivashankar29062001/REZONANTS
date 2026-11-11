import { ReactNode } from 'react'

type TFunction = (key: string, options?: Record<string, unknown>) => string

interface TranslationContextValue {
  lang: string
  loading: boolean
  isRtl: boolean
  setLanguage: (code: string) => Promise<void>
  t: TFunction
}

export function TranslationProvider(props: { children: ReactNode }): JSX.Element
export function useTranslation(): TranslationContextValue
export const i18n: any
