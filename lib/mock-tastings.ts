export type MockTasting = {
  title: string
  subtitle: string
  rating: number
  tags: string[]
  note: string
  date: string
}

export const MOCK_TASTINGS: MockTasting[] = [
  {
    title: 'Barolo Riserva 2013',
    subtitle: 'Rødvin - Piemonte',
    rating: 5,
    tags: ['Roser', 'Tjære', 'Kirsebær', '+1'],
    note: 'En af de bedste Baroloer jeg har smagt. Fantastisk struktur og dybde.',
    date: '8. april 2026',
  },
  {
    title: 'To Øl Black Ball Porter',
    subtitle: 'Baltic Porter',
    rating: 4,
    tags: ['Kaffe', 'Tørret frugt', 'Lakridspulver'],
    note: 'Rigtig god dansk porter. Perfekt til koldt vejr.',
    date: '5. april 2026',
  },
  {
    title: 'Glenfiddich 18',
    subtitle: 'Single Malt - Speyside',
    rating: 4,
    tags: ['Æble', 'Egetræ', 'Honning'],
    note: 'Flot balanceret whisky. God kompleksitet for prisen.',
    date: '2. april 2026',
  },
]
