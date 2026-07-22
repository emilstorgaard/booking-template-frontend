<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Testimonials from '$lib/components/sections/Testimonials.svelte';
</script>

<SeoHead seo={{ metaTitle: 'Anmeldelser', metaDescription: 'Se hvad vores klienter siger om os.' }} />

<div class="mx-auto max-w-3xl px-4 pt-14 sm:pt-20">
	<span class="text-xs font-semibold tracking-wide text-tide uppercase">Anmeldelser</span>
	<h1 class="font-display mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
		Det siger vores klienter
	</h1>
</div>

<Testimonials limit={6} showHeading={false} />