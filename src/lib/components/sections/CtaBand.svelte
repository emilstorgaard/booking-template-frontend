<script lang="ts">
	import Wave from '$lib/components/ui/Wave.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		title = 'Klar til at booke din tid?',
		text = 'Det tager under et minut, og du kan altid ændre den igen senere.'
	}: { title?: string; text?: string } = $props();
</script>

<section class="relative overflow-hidden bg-tide">
	<Wave tone="dark" class="absolute inset-x-0 top-0 h-16 -translate-y-1 opacity-40 sm:h-24" />

	<div class="relative mx-auto max-w-3xl px-4 py-14 text-center sm:py-20">
		<h2 class="font-display text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
		<p class="mx-auto mt-3 max-w-md text-sm text-white/80 sm:text-base">{text}</p>
		<Button href="/book" variant="inverse" size="lg" class="mt-7">Se ledige tider</Button>
	</div>
</section>