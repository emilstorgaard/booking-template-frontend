<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import { faqItems } from '$lib/data/faq';
</script>

<SeoHead seo={{ metaTitle: 'Ofte stillede spørgsmål', metaDescription: 'Svar på de mest almindelige spørgsmål.' }} />

<div class="mx-auto max-w-3xl px-4 py-14 sm:py-20">
	<span class="text-xs font-semibold tracking-wide text-tide uppercase">FAQ</span>
	<h1 class="font-display mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
		Ofte stillede spørgsmål
	</h1>
	<div class="mt-8">
		<Accordion items={faqItems} />
	</div>
</div>