import type { Service } from '$lib/types/content';

// Eksempeldata — udskift med jeres egne ydelser og priser.
export const services: Service[] = [
	{
		id: 'srv-1',
		slug: 'foerste-konsultation',
		title: 'Første konsultation',
		shortDescription: 'En grundig samtale og undersøgelse, så vi forstår dit behov.',
		description:
			'Vi starter med en samtale om dine udfordringer og en fysisk undersøgelse, så behandlingen kan målrettes præcis dig.',
		durationMinutes: 45,
		price: 595
	},
	{
		id: 'srv-2',
		slug: 'behandling',
		title: 'Behandling',
		shortDescription: 'Opfølgende behandling tilpasset din plan.',
		description:
			'En standardbehandling, hvor vi arbejder videre med den plan, der er lagt ved din første konsultation.',
		durationMinutes: 30,
		price: 425
	},
	{
		id: 'srv-3',
		slug: 'genoptraening',
		title: 'Genoptræning',
		shortDescription: 'Målrettede øvelser til at genopbygge styrke og bevægelighed.',
		description:
			'Et forløb med øvelser og vejledning, der hjælper dig sikkert tilbage til hverdagen og dine aktiviteter.',
		durationMinutes: 45,
		price: 495
	},
	{
		id: 'srv-4',
		slug: 'akut-tid',
		title: 'Akut tid',
		shortDescription: 'Hurtig hjælp ved pludselige smerter.',
		description: 'En kort tid, hvor vi kan se på akutte smerter og give dig de første gode råd.',
		durationMinutes: 20,
		price: 325
	}
];