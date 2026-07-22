<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { services } from '$lib/data/services';
</script>

<SeoHead seo={{ metaTitle: 'Ydelser og priser', metaDescription: 'Se vores behandlinger og priser.' }} />

<div class="mx-auto max-w-3xl px-4 py-14 sm:py-20">
	<span class="text-xs font-semibold tracking-wide text-tide uppercase">Ydelser</span>
	<h1 class="font-display mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
		Behandlinger og priser
	</h1>
	<p class="mt-4 max-w-xl text-slate-600">
		Priserne herunder er vejledende eksempler — ret dem til, så de matcher jeres faktiske ydelser.
	</p>

	<div class="mt-8 grid gap-5 sm:grid-cols-2">
		{#each services as service (service.id)}
			<Card class="flex flex-col">
				<h2 class="font-display text-lg font-semibold text-slate-900">{service.title}</h2>
				<p class="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">{service.description}</p>
				<div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
					<span class="text-sm text-slate-500">{service.durationMinutes} min.</span>
					<span class="font-display text-lg font-semibold text-tide">{service.price} kr.</span>
				</div>
			</Card>
		{/each}
	</div>

	<div class="mt-10 text-center">
		<Button href="/book" size="lg">Book en tid</Button>
	</div>
</div>