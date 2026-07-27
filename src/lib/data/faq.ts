import type { FaqItem } from '$lib/types/content';

export const faqItems: FaqItem[] = [
	{
		id: 'hvad-koster-det',
		question: 'Hvad koster en tid?',
		answer:
			'Prisen fremgår ved booking af den enkelte tid. Kontakt os, hvis du har spørgsmål inden du booker.'
	},
	{
		id: 'hvor-lang-tid',
		question: 'Hvor lang tid varer en tid?',
		answer:
			'Det varierer efter type af tid — varigheden fremgår altid, når du vælger et tidspunkt i kalenderen.'
	},
	{
		id: 'aflysning',
		question: 'Kan jeg flytte eller aflyse min tid?',
		answer:
			'Ja. Du kan aflyse din booking under "Mine bookinger", så længe det sker i god tid, så andre kan nå at booke tiden.'
	},
	{
		id: 'oprette-bruger',
		question: 'Skal jeg oprette en bruger for at booke?',
		answer:
			'Ja, du skal være logget ind for at booke en tid. Det tager under et minut at oprette en bruger.'
	},
	{
		id: 'aendre-oplysninger',
		question: 'Kan jeg se mine tidligere bookinger?',
		answer:
			'Ja, alle dine kommende bookinger vises under "Mine bookinger", når du er logget ind.'
	},
	{
		id: 'kontakt',
		question: 'Hvad hvis jeg har spørgsmål, der ikke er besvaret her?',
		answer: 'Du er altid velkommen til at kontakte os direkte, så hjælper vi dig videre.'
	}
];