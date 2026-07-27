<script lang="ts">
	import CtaBand from '$lib/components/sections/CtaBand.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import { faqItems } from '$lib/data/faq';
</script>

<SeoHead seo={{ metaTitle: 'Ofte stillede spørgsmål', metaDescription: 'Svar på de mest almindelige spørgsmål om booking.' }} />

<div class="relative overflow-hidden bg-[#ECF0E9]">
	<div
		class="pointer-events-none absolute -top-[15%] left-[-8%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,_rgba(70,96,90,0.10),_transparent_70%)]"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-2xl px-4 pt-20 pb-12 sm:pt-28 sm:pb-16">
		<span class="inline-flex items-center gap-2 rounded-full border border-[#172420]/10 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#96392C] uppercase backdrop-blur-sm">
			FAQ
		</span>

		<h1 class="mt-7 font-['Instrument_Serif'] text-4xl leading-[1.1] text-[#172420] italic sm:text-5xl">
			Ofte stillede spørgsmål
		</h1>

		<p class="mt-6 max-w-xl text-base leading-relaxed text-[#46605A] sm:text-lg">
			Find svar på de mest almindelige spørgsmål om booking. Er du i tvivl om noget, er du altid
			velkommen til at kontakte os.
		</p>
	</div>
</div>

<div class="mx-auto max-w-2xl px-4 pb-24">
	<Accordion items={faqItems} />
</div>

<CtaBand title="Klar til at booke en tid hos os?" text="Vi glæder os til at møde dig — og din krop." />