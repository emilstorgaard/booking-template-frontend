<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import MovementLine from '$lib/components/ui/MovementLine.svelte';

	const steps = [
		{ title: 'Vælg en dag', text: 'Se de kommende uger, og find en dag der passer ind i din kalender.' },
		{ title: 'Vælg et tidspunkt', text: 'Kun de tider der reelt er ledige bliver vist — ingen gætteri.' },
		{ title: 'Bekræft', text: 'Bekræft med ét klik. Fortryder du, kan du altid ændre den igen.' }
	];
</script>

<section class="bg-[#ECF0E9] px-4 pt-6 pb-20 sm:pt-8 sm:pb-28">
	<div class="mx-auto max-w-5xl">
		<div class="max-w-md">
			<span class="text-[11px] font-semibold tracking-[0.24em] text-[#96392C] uppercase">Sådan foregår det</span>
			<h2 class="mt-3 font-['Instrument_Serif'] text-3xl text-[#172420] italic sm:text-4xl">
				Tre trin til din booking
			</h2>
		</div>

		<div class="mt-6 max-w-xs text-[#172420]/15">
			<MovementLine />
		</div>

		<ol class="mt-10 grid gap-6 sm:grid-cols-3">
			{#each steps as step}
				<li>
					<Card>
						<h3 class="font-['Instrument_Serif'] text-2xl text-[#172420] italic">{step.title}</h3>
						<p class="mt-2 text-sm leading-relaxed text-[#46605A]">{step.text}</p>
					</Card>
				</li>
			{/each}
		</ol>
	</div>
</section>