export type StaticAssets = Record<string, string>

export const certificatePartners = [
  {
    id: 'psa',
    name: 'PSA',
    description: 'Professional Sports Authenticator',
    logo: '/legends/certificates/psa.svg',
    url: 'https://www.psacard.com/',
  },
  {
    id: 'beckett',
    name: 'Beckett Authentication Services',
    description: 'Industry-leading autograph authentication',
    logo: '/legends/certificates/beckett.svg',
    url: 'https://www.beckett.com/authentication/',
  },
  {
    id: 'jsa',
    name: 'JSA',
    description: 'James Spence Authentication',
    logo: '/legends/certificates/jsa.svg',
    url: 'https://www.spenceloa.com/',
  },
] as const
