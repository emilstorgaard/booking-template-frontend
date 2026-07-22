<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Hero from '$lib/components/sections/Hero.svelte';
	import HowItWorks from '$lib/components/sections/HowItWorks.svelte';
	import ServicesPreview from '$lib/components/sections/ServicesPreview.svelte';
	import Testimonials from '$lib/components/sections/Testimonials.svelte';
	import CtaBand from '$lib/components/sections/CtaBand.svelte';

	let { data } = $props();
	const p = $derived(data.page.properties);
</script>

<SeoHead seo={p} />

<div class="overflow-hidden">
	<Hero title={p?.title} />
	<HowItWorks />
	<ServicesPreview />
	<Testimonials limit={3} />
	<CtaBand />
</div>