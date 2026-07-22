<script lang="ts">
	import { testimonials } from '$lib/data/testimonials';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import StarRating from '$lib/components/ui/StarRating.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { limit = 3, showHeading = true }: { limit?: number; showHeading?: boolean } = $props();
</script>

<section class="mx-auto max-w-3xl px-4 py-10 sm:py-14">
	{#if showHeading}
		<SectionHeading eyebrow="Anmeldelser" title="Hvad vores klienter siger" align="center" />
	{/if}
	<div class="mt-8 grid gap-5 sm:grid-cols-3">
		{#each testimonials.slice(0, limit) as t (t.id)}
			<Card class="flex flex-col gap-3">
				<StarRating rating={t.rating} />
				<p class="text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
				<p class="mt-auto text-sm font-medium text-slate-900">
					{t.name}
					{#if t.role}<span class="font-normal text-slate-400"> · {t.role}</span>{/if}
				</p>
			</Card>
		{/each}
	</div>
</section>