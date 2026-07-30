<script lang="ts">
	import CtaBand from '$lib/components/sections/CtaBand.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import { faqItems } from '$lib/data/faq';
</script>

<SeoHead seo={{ metaTitle: 'Ofte stillede spørgsmål', metaDescription: 'Svar på de mest almindelige spørgsmål om booking.' }} />

<div class="relative overflow-hidden bg-[#ECF0E9]">
	<div
		class="pointer-events-none absolute -top-[15%] left-[-8%] h-[380px] w-[380px] rounded-full"
		aria-hidden="true"
		style="background: radial-gradient(circle, rgba(70,96,90,0.10), transparent 70%)"
	></div>

	<div class="relative mx-auto max-w-3xl px-4 pt-20 pb-12 sm:pt-28 sm:pb-16">
		<div class="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
			<div class="max-w-xl">
				<span
					class="inline-flex items-center gap-2 rounded-full border border-[#172420]/10 bg-white/70 px-4 py-1.5 font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.18em] text-[#96392C] uppercase backdrop-blur-sm"
				>
					FAQ
				</span>

				<h1 class="mt-7 font-['Instrument_Serif'] text-4xl leading-[1.1] text-[#172420] italic sm:text-5xl">
					Spørgsmål &amp; svar
				</h1>

				<p class="mt-6 max-w-lg text-base leading-relaxed text-[#46605A] sm:text-lg">
					Find svar på de mest almindelige spørgsmål. Er du i tvivl om noget, er du altid velkommen
					til at kontakte os direkte.
				</p>
			</div>

			<div class="shrink-0 sm:pt-2">
				<div class="overflow-hidden rounded-[24px] border border-[#172420]/8 bg-white p-6 shadow-[0_15px_40px_-25px_rgba(23,36,32,0.25)]">
					<p class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.16em] text-[#46605A]/60 uppercase">Har du et spørgsmål?</p>
					<p class="mt-2 text-sm text-[#172420]">
						<a href="mailto:hej@example.dk" class="underline decoration-[#172420]/20 underline-offset-2 transition hover:decoration-[#96392C] hover:text-[#96392C]">
							hej@example.dk
						</a>
					</p>
					<a
						href="/book"
						class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#172420] px-4 py-2 text-xs font-semibold text-[#ECF0E9] transition hover:bg-[#46605A]"
					>
						Book en tid
						<svg viewBox="0 0 16 16" class="h-3 w-3" fill="none" aria-hidden="true">
							<path d="M2 8h10M8 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="bg-[#ECF0E9] px-4 pb-24">
	<div class="mx-auto max-w-2xl">
		<Accordion items={faqItems} />
	</div>
</div>

<CtaBand title="Klar til at booke en tid hos os?" text="Vi glæder os til at møde dig." />