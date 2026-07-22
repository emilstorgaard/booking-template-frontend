export interface Service {
	id: string;
	slug: string;
	title: string;
	shortDescription: string;
	description: string;
	durationMinutes: number;
	price: number;
}

export interface Testimonial {
	id: string;
	name: string;
	role?: string;
	rating: number; // 1–5
	quote: string;
}

export interface FaqItem {
	id: string;
	question: string;
	answer: string;
}

export interface TeamMember {
	id: string;
	name: string;
	title: string;
	bio: string;
}