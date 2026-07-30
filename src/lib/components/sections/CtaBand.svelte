<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	let {
		title = 'Klar til at booke din tid?',
		text = 'Det tager under et minut, og du kan altid ændre den igen senere.'
	}: { title?: string; text?: string } = $props();
</script>

<section class="relative overflow-hidden bg-[#172420]">
	<div
		class="pointer-events-none absolute inset-0"
		aria-hidden="true"
		style="background: radial-gradient(ellipse 90% 60% at 50% 110%, rgba(150,57,44,0.4), transparent), radial-gradient(circle at 8% 50%, rgba(198,137,88,0.07), transparent 50%)"
	></div>

	<svg
		viewBox="0 0 800 300"
		preserveAspectRatio="none"
		class="pointer-events-none absolute inset-0 h-full w-full text-white/[0.04]"
		aria-hidden="true"
	>
		<path
			d="M-40,220 C100,80 220,280 360,140 C480,20 560,220 680,100 C760,20 800,80 840,40"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
		/>
	</svg>

	<div class="relative mx-auto max-w-2xl px-4 py-20 text-center sm:py-28">
		<span
			class="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#ECF0E9]/55 uppercase"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-[#96392C]"></span>
			Åben for booking
		</span>

		<h2 class="mt-7 font-['Instrument_Serif'] text-4xl text-[#ECF0E9] italic sm:text-5xl">{title}</h2>
		<p class="mx-auto mt-4 max-w-md text-base text-[#ECF0E9]/55">{text}</p>

		<div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
			<Button href="/book" variant="inverse" size="lg">Se ledige tider</Button>
			<a
				href="/om"
				class="text-sm text-[#ECF0E9]/45 underline decoration-[#ECF0E9]/20 underline-offset-4 transition hover:text-[#ECF0E9]/75"
			>
				Lær os at kende
			</a>
		</div>
	</div>
</section>