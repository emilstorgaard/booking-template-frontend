<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import CtaBand from '$lib/components/sections/CtaBand.svelte';
	import { team } from '$lib/data/team';
</script>

<SeoHead seo={{ metaTitle: 'Om os', metaDescription: 'Lær mere om os, og hvem der står bag.' }} />

<div class="relative overflow-hidden bg-[#ECF0E9]">
	<div
		class="pointer-events-none absolute -top-[15%] right-[-8%] h-[380px] w-[380px] rounded-full"
		aria-hidden="true"
		style="background: radial-gradient(circle, rgba(198,137,88,0.12), transparent 70%)"
	></div>

	<div class="relative mx-auto max-w-3xl px-4 pt-20 pb-12 sm:pt-28 sm:pb-16">
		<span
			class="inline-flex items-center gap-2 rounded-full border border-[#172420]/10 bg-white/70 px-4 py-1.5 font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.18em] text-[#96392C] uppercase backdrop-blur-sm"
		>
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

<div class="border-y border-[#172420]/6 bg-white">
	<div class="mx-auto max-w-3xl px-4 py-10">
		<blockquote class="font-['Instrument_Serif'] text-2xl leading-snug text-[#172420] italic sm:text-3xl">
			&ldquo;Vi tror på, at gode oplevelser starter med en nem og respektfuld booking.&rdquo;
		</blockquote>
	</div>
</div>

<section class="bg-[#ECF0E9] px-4 pt-14 pb-24">
	<div class="mx-auto max-w-5xl">
		<div class="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<span class="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#96392C] uppercase">
					<span class="h-px w-5 bg-[#96392C]/50"></span>
					Teamet
				</span>
				<h2 class="mt-3 font-['Instrument_Serif'] text-3xl text-[#172420] italic sm:text-4xl">
					Mød dem bag
				</h2>
			</div>
		</div>

		<div class="mt-10 grid gap-5 sm:grid-cols-3">
			{#each team as member (member.id)}
				<div
					class="group overflow-hidden rounded-[28px] border border-[#172420]/8 bg-white shadow-[0_15px_40px_-25px_rgba(23,36,32,0.25)] transition hover:border-[#172420]/14 hover:shadow-[0_20px_50px_-25px_rgba(23,36,32,0.32)]"
				>
					<div class="h-2 w-full bg-gradient-to-r from-[#172420] via-[#46605A] to-[#96392C] opacity-70"></div>
					<div class="p-7">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-full bg-[#172420] shadow-[0_8px_20px_-8px_rgba(23,36,32,0.5)]"
							aria-hidden="true"
						>
							<span class="font-['Instrument_Serif'] text-xl text-[#ECF0E9] italic">
								{member.name.charAt(0)}
							</span>
						</div>
						<h3 class="mt-4 font-['Instrument_Serif'] text-xl text-[#172420] italic">{member.name}</h3>
						<p class="mt-0.5 font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.14em] text-[#96392C] uppercase">
							{member.title}
						</p>
						<p class="mt-4 text-sm leading-relaxed text-[#46605A]">{member.bio}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<CtaBand title="Klar til at booke en tid?" text="Vi glæder os til at høre fra dig." />