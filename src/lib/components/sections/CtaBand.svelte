<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	let {
		title = 'Klar til at booke din tid?',
		text = 'Det tager under et minut, og du kan altid ændre den igen senere.'
	}: { title?: string; text?: string } = $props();
</script>

<section class="relative overflow-hidden bg-[#172420]">
	<svg
		viewBox="0 0 800 300"
		preserveAspectRatio="none"
		class="pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]"
		aria-hidden="true"
	>
		<path
			d="M-40,220 C100,80 220,280 360,140 C480,20 560,220 680,100 C760,20 800,80 840,40"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		/>
	</svg>

	<div class="relative mx-auto max-w-2xl px-4 py-20 text-center sm:py-24">
		<span
			class="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#ECF0E9]/70 uppercase"
		>
			Åben for booking
		</span>

		<h2 class="mt-6 font-['Instrument_Serif'] text-3xl text-[#ECF0E9] italic sm:text-4xl">{title}</h2>
		<p class="mx-auto mt-3 max-w-md text-sm text-[#ECF0E9]/70 sm:text-base">{text}</p>
		<Button href="/book" variant="inverse" size="lg" class="mt-9">Se ledige tider</Button>
	</div>
</section>