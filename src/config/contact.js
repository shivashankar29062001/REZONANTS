// Single canonical source of truth for all Rezonants company contact details,
// office locations, business hours, booking links, and official social URLs.
// Do NOT duplicate phone numbers, emails, or street addresses in other modules.

export const COMPANY = {
  name: 'Rezonants',
  uppercaseName: 'REZONANTS',
  legalName: 'Rezonant Solutions Private Limited',
  southAfricaCompany: 'REZONANTS PVT LTD',
  website: 'rezonants.com',
  websiteUrl: 'https://rezonants.com',
  bookConsultationPath: '/book-consultation',
}

export const CONTACT = {
  company: COMPANY.uppercaseName,
  companyName: COMPANY.name,
  website: COMPANY.website,
  websiteUrl: COMPANY.websiteUrl,
  phone: '18004103299',
  phoneHref: 'tel:18004103299',
  phoneDisplay: '1800 410 3299',
  email: 'info@rezonants.com',
  emailHref: 'mailto:info@rezonants.com',
  gmailComposeUrl:
    'https://mail.google.com/mail/?view=cm&fs=1&to=info%40rezonants.com',
  hours: 'Mon – Sat, 9:30 – 18:30 IST',
  hoursDetailed: 'Monday – Saturday, 9:30 – 18:30 IST',
  addressLine: 'SBR Towers, Axis bank building, Madhapur, Hyderabad',
  address:
    'SBR Towers, Axis bank building, Second Floor, D No 1/98/93/23, HUDA Tecno Encalve Cyber Hills Colony, VIP Hills, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081',
  mapsHref:
    'https://www.google.com/maps/dir/?api=1&destination=Second+Floor,+Samridhi+Vasyam,+D+No+1%2F98%2F9%2F3%2F23,+Capital+Pk+Rd,+beside+Narayana+High+School,+Cyber+Hills+Colony,+VIP+Hills,+Jaihind+Enclave,+Madhapur,+Hyderabad,+Telangana+500081',
  vijayawadaAddress:
    'D.No. 24-29-210A, Durgapuram, Gulabithota Road, Vijayawada, NTR District, Andhra Pradesh – 520003',
  vijayawadaMapsHref:
    'https://www.google.com/maps/search/D.No.+24-29-210A,+Durgapuram,+Gulabithota+Road,+Vijayawada,+NTR+District,+Andhra+Pradesh+520003',
  southAfricaCompany: COMPANY.southAfricaCompany,
  southAfricaAddress:
    'Unit 11, Sunset View, 10 Hazy Street, Newcastle, Kwa-Zulu Natal, 2930, South Africa',
  southAfricaMapsHref:
    'https://www.google.com/maps/search/Unit+11+Sunset+View+10+Hazy+Street+Newcastle+Kwa-Zulu+Natal+2930+South+Africa',
  sandtonAddress:
    'Rayburn House, 1–3 Mellis Road, Edenburg, Rivonia, Sandton 2146, South Africa',
  sandtonMapsHref:
    'https://www.google.com/maps/search/Rayburn+House,+1-3+Mellis+Road,+Edenburg,+Rivonia,+Sandton+2146,+South+Africa',
  dubaiAddress: 'Dubai, United Arab Emirates',
  dubaiMapsHref:
    'https://www.google.com/maps/search/Dubai,+United+Arab+Emirates',
  social: {
    linkedin: 'https://www.linkedin.com/company/rezonants/',
    twitter: 'https://twitter.com/rezonants',
    instagram: 'https://www.instagram.com/rezonants_/',
  },
}

export const OFFICE_LOCATIONS = [
  {
    id: 'hyderabad',
    title: 'Hyderabad Office (India Headquarters)',
    contactLabelKey: 'contact.office',
    contactLabelDefault: 'Office',
    footerLabelKey: 'footer.hyderabadLocation',
    footerLabelDefault: 'Hyderabad, India',
    contactAriaLabel: 'Open office location on Google Maps',
    footerAriaLabel: 'Open India office location on Google Maps',
    address: CONTACT.address,
    mapsHref: CONTACT.mapsHref,
  },
  {
    id: 'vijayawada',
    title: 'Vijayawada Office (India)',
    contactLabelKey: 'contact.offices.vijayawada',
    contactLabelDefault: 'Vijayawada Office',
    footerLabelKey: 'footer.vijayawadaLocation',
    footerLabelDefault: 'Vijayawada, Andhra Pradesh',
    contactAriaLabel: 'Open Vijayawada office location on Google Maps',
    footerAriaLabel: 'Open Vijayawada office location on Google Maps',
    address: CONTACT.vijayawadaAddress,
    mapsHref: CONTACT.vijayawadaMapsHref,
  },
  {
    id: 'newcastle',
    title: 'South Africa Office (Newcastle)',
    contactLabelKey: 'contact.offices.southAfrica',
    contactLabelDefault: 'South Africa Office — Newcastle',
    footerLabelKey: 'footer.southAfricaLocation',
    footerLabelDefault: 'South Africa – REZONANTS PVT LTD',
    contactAriaLabel: 'Open South Africa office location on Google Maps',
    footerAriaLabel: 'Open South Africa office location on Google Maps',
    company: CONTACT.southAfricaCompany,
    address: CONTACT.southAfricaAddress,
    mapsHref: CONTACT.southAfricaMapsHref,
  },
  {
    id: 'sandton',
    title: 'South Africa Office (Sandton)',
    contactLabelKey: 'contact.offices.sandton',
    contactLabelDefault: 'South Africa Office — Sandton',
    footerLabelKey: 'footer.sandtonLocation',
    footerLabelDefault: 'Sandton, South Africa',
    contactAriaLabel: 'Open Sandton office location on Google Maps',
    footerAriaLabel: 'Open Sandton office location on Google Maps',
    address: CONTACT.sandtonAddress,
    mapsHref: CONTACT.sandtonMapsHref,
  },
  {
    id: 'dubai',
    title: 'Dubai Office (UAE)',
    contactLabelKey: 'contact.offices.dubai',
    contactLabelDefault: 'Dubai Office',
    footerLabelKey: 'footer.dubaiLocation',
    footerLabelDefault: 'Dubai, UAE',
    contactAriaLabel: 'Open Dubai office location on Google Maps',
    footerAriaLabel: 'Open Dubai office location on Google Maps',
    address: CONTACT.dubaiAddress,
    mapsHref: CONTACT.dubaiMapsHref,
  },
]

export function formatOfficeListText() {
  return [
    `- Hyderabad, India (Headquarters): ${CONTACT.address}`,
    `- Vijayawada, India: ${CONTACT.vijayawadaAddress}`,
    `- South Africa (Newcastle): ${CONTACT.southAfricaCompany}, ${CONTACT.southAfricaAddress}`,
    `- South Africa (Sandton): ${CONTACT.sandtonAddress}`,
    `- Dubai, UAE: ${CONTACT.dubaiAddress}`,
  ].join('\n')
}

