<script lang="ts">
	let {
		eyebrow,
		title,
		subtitle,
		align = 'left'
	}: { eyebrow?: string; title: string; subtitle?: string; align?: 'left' | 'center' } = $props();
</script>

<div class={align === 'center' ? 'mx-auto max-w-xl text-center' : ''}>
	{#if eyebrow}
		<span class="text-xs font-semibold tracking-wide text-tide uppercase">{eyebrow}</span>
	{/if}
	<h2 class="font-display mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h2>
	{#if subtitle}
		<p class="mt-3 text-slate-600">{subtitle}</p>
	{/if}
</div>