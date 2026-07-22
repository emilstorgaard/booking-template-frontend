import type { FaqItem } from '$lib/types/content';

export const faqItems: FaqItem[] = [
	{
		id: 'faq-1',
		question: 'Hvordan booker jeg en tid?',
		answer:
			'Opret en bruger, og gå til "Book tid" i menuen. Vælg en ledig dag og et tidspunkt, og bekræft med ét klik.'
	},
	{
		id: 'faq-2',
		question: 'Kan jeg afbestille eller flytte min tid?',
		answer:
			'Ja. Under "Mine bookinger" kan du selv aflyse din tid. Kontakt os, hvis du har brug for at flytte den i stedet.'
	},
	{
		id: 'faq-3',
		question: 'Skal jeg forberede mig til første besøg?',
		answer: 'Nej, du skal blot møde op til tiden. Tag gerne løst tøj på, hvis behandlingen kræver bevægelse.'
	},
	{
		id: 'faq-4',
		question: 'Hvad koster en behandling?',
		answer: 'Se de aktuelle priser under "Ydelser" — de varierer efter behandlingstype og varighed.'
	},
	{
		id: 'faq-5',
		question: 'Tager I imod sundhedsforsikring?',
		answer: 'Det afhænger af dit forsikringsselskab. Kontakt os gerne, så hjælper vi med at afklare det.'
	}
];