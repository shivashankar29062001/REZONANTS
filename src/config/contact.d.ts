export interface OfficeLocation {
  id: string
  title: string
  contactLabelKey: string
  contactLabelDefault: string
  footerLabelKey: string
  footerLabelDefault: string
  contactAriaLabel: string
  footerAriaLabel: string
  company?: string
  address: string
  mapsHref: string
}

export const COMPANY: {
  name: string
  uppercaseName: string
  legalName: string
  southAfricaCompany: string
  website: string
  websiteUrl: string
  bookConsultationPath: string
}

export const CONTACT: {
  company: string
  companyName: string
  website: string
  websiteUrl: string
  phone: string
  phoneHref: string
  phoneDisplay: string
  email: string
  emailHref: string
  gmailComposeUrl: string
  hours: string
  hoursDetailed: string
  addressLine: string
  address: string
  mapsHref: string
  vijayawadaAddress: string
  vijayawadaMapsHref: string
  southAfricaCompany: string
  southAfricaAddress: string
  southAfricaMapsHref: string
  dubaiAddress: string
  dubaiMapsHref: string
  social: {
    linkedin: string
    twitter: string
    instagram: string
  }
}

export const OFFICE_LOCATIONS: OfficeLocation[]

export function formatOfficeListText(): string

