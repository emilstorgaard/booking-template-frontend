import type { Testimonial } from '$lib/types/content';

export const testimonials: Testimonial[] = [
	{
		id: 't-1',
		name: 'Maria J.',
		role: 'Klient siden 2023',
		rating: 5,
		quote:
			'Jeg blev mødt med ro og faglighed fra første besøg. Booking var nem, og jeg fik hjælp med det samme.'
	},
	{
		id: 't-2',
		name: 'Peter K.',
		rating: 5,
		quote:
			'Endelig et sted hvor jeg føler mig hørt. Kunne booke online sent om aftenen, som passede mig bedst.'
	},
	{
		id: 't-3',
		name: 'Sofie L.',
		role: 'Klient siden 2024',
		rating: 4,
		quote: 'God og grundig behandling. Jeg sætter pris på at kunne se og ændre min tid selv.'
	},
	{
		id: 't-4',
		name: 'Anders M.',
		rating: 5,
		quote: 'Professionelt fra start til slut. Kan varmt anbefales til alle med ondt i kroppen.'
	},
	{
		id: 't-5',
		name: 'Camilla R.',
		rating: 5,
		quote: 'Rar atmosfære og dygtige behandlere. Jeg glæder mig hver gang til min tid.'
	},
	{
		id: 't-6',
		name: 'Thomas B.',
		rating: 4,
		quote: 'Nem online booking og en meget kompetent behandling. Kommer helt sikkert igen.'
	}
];