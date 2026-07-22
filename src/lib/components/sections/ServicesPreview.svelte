<script lang="ts">
	import { services } from '$lib/data/services';
	import Card from '$lib/components/ui/Card.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
</script>

<section class="border-t border-slate-100 bg-slate-50/60">
	<div class="mx-auto max-w-3xl px-4 py-10 sm:py-14">
		<SectionHeading eyebrow="Ydelser" title="Det kan vi hjælpe med" />
		<div class="mt-8 grid gap-5 sm:grid-cols-2">
			{#each services.slice(0, 4) as service (service.id)}
				<Card>
					<h3 class="font-display text-base font-semibold text-slate-900">{service.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-slate-500">{service.shortDescription}</p>
					<p class="mt-3 text-sm font-medium text-tide">
						{service.durationMinutes} min · fra {service.price} kr.
					</p>
				</Card>
			{/each}
		</div>
		<a href="/ydelser" class="mt-6 inline-block text-sm font-medium text-tide hover:underline">
			Se alle ydelser og priser →
		</a>
	</div>
</section>