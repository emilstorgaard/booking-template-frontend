<script lang="ts">
	import { mediaSrc } from '$lib/utils/media';
	import type { SeoProperties } from '$lib/types/seo';

	let { seo }: { seo: SeoProperties } = $props();

	const ogImage = $derived(seo?.ogImage?.[0]);
	const ogImageUrl = $derived(ogImage ? mediaSrc(ogImage.url, 'og', 'jpg') : '');
</script>

<svelte:head>
	<title>{seo.metaTitle}</title>
	<meta name="description" content={seo.metaDescription} />

	<meta property="og:title" content={seo.metaTitle} />
	<meta property="og:description" content={seo.metaDescription} />
	<meta property="og:type" content="website" />
	{#if ogImage}
		<meta property="og:image" content={ogImageUrl} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
</svelte:head>
