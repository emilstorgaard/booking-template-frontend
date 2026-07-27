<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import CtaBand from '$lib/components/sections/CtaBand.svelte';
	import { team } from '$lib/data/team';
</script>

<SeoHead seo={{ metaTitle: 'Om os', metaDescription: 'Lær mere om os, og hvem der står bag.' }} />

<div class="relative overflow-hidden bg-[#ECF0E9]">
	<div class="pointer-events-none absolute -top-[15%] right-[-8%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,_rgba(198,137,88,0.12),_transparent_70%)]" aria-hidden="true"></div>

	<div class="relative mx-auto max-w-2xl px-4 pt-20 pb-12 sm:pt-28 sm:pb-16">
		<span class="inline-flex items-center gap-2 rounded-full border border-[#172420]/10 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#96392C] uppercase backdrop-blur-sm">
			Om os
		</span>

		<h1 class="mt-7 font-['Instrument_Serif'] text-4xl leading-[1.1] text-[#172420] italic sm:text-5xl">
			Kort om os
		</h1>

		<p class="mt-6 max-w-xl text-base leading-relaxed text-[#46605A] sm:text-lg">
			Her beskriver du kort, hvem I er, og hvad der gør jeres tilgang særlig. Denne tekst er
			placeholder og erstattes med det rigtige indhold, når siden tages i brug.
		</p>
	</div>
</div>

<section class="bg-[#ECF0E9] px-4 pt-2 pb-24">
	<div class="mx-auto max-w-5xl">
		<span class="text-[11px] font-semibold tracking-[0.24em] text-[#96392C] uppercase">Teamet</span>
		<h2 class="mt-3 font-['Instrument_Serif'] text-3xl text-[#172420] italic sm:text-4xl">
			Mød dem bag
		</h2>

		<div class="mt-10 grid gap-6 sm:grid-cols-3">
			{#each team as member (member.id)}
				<Card class="text-center">
					<div
						class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#96392C]/10"
						aria-hidden="true"
					>
						<span class="font-['Instrument_Serif'] text-xl text-[#96392C] italic">
							{member.name.charAt(0)}
						</span>
					</div>
					<h3 class="mt-4 font-['Instrument_Serif'] text-lg text-[#172420] italic">{member.name}</h3>
					<p class="mt-1 text-[11px] font-semibold tracking-[0.14em] text-[#96392C] uppercase">
						{member.title}
					</p>
					<p class="mt-3 text-sm leading-relaxed text-[#46605A]">{member.bio}</p>
				</Card>
			{/each}
		</div>
	</div>
</section>

<CtaBand title="Klar til at booke en tid?" text="Vi glæder os til at høre fra dig." />