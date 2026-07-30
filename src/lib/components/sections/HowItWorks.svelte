<script lang="ts">
	const steps = [
		{ n: '01', title: 'Vælg en dag', text: 'Se de kommende uger, og find en dag der passer ind i din kalender.' },
		{ n: '02', title: 'Vælg et tidspunkt', text: 'Kun de tider der reelt er ledige bliver vist — ingen gætteri.' },
		{ n: '03', title: 'Bekræft', text: 'Bekræft med ét klik. Fortryder du, kan du altid ændre den igen.' }
	];
</script>

<section class="bg-[#ECF0E9] px-4 pt-4 pb-24 sm:pb-32">
	<div class="mx-auto max-w-5xl">
		<div class="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<span class="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#96392C] uppercase">
					<span class="h-px w-5 bg-[#96392C]/50"></span>
					Sådan foregår det
				</span>
				<h2 class="mt-3 font-['Instrument_Serif'] text-3xl text-[#172420] italic sm:text-4xl">
					Tre trin til din booking
				</h2>
			</div>
			<a
				href="/book"
				class="hidden shrink-0 text-sm font-medium text-[#46605A] underline decoration-[#46605A]/30 underline-offset-4 transition hover:text-[#172420] sm:block"
			>
				Book en tid nu →
			</a>
		</div>

		<ol class="mt-12 grid gap-5 sm:grid-cols-3">
			{#each steps as step}
				<li
					class="group relative overflow-hidden rounded-[28px] border border-[#172420]/8 bg-white p-7 shadow-[0_15px_40px_-25px_rgba(23,36,32,0.25)] transition hover:border-[#172420]/14 hover:shadow-[0_20px_50px_-25px_rgba(23,36,32,0.32)]"
				>
					<span
						class="pointer-events-none absolute -right-2 -bottom-5 select-none font-['Instrument_Serif'] text-[8rem] leading-none text-[#172420]/[0.042] italic"
						aria-hidden="true"
					>
						{step.n}
					</span>

					<div
						class="flex h-9 w-9 items-center justify-center rounded-full border border-[#96392C]/20 bg-[#96392C]/8 font-['IBM_Plex_Mono'] text-[11px] font-bold tracking-[0.06em] text-[#96392C]"
					>
						{step.n}
					</div>

					<h3 class="mt-5 font-['Instrument_Serif'] text-2xl text-[#172420] italic">{step.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-[#46605A]">{step.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>