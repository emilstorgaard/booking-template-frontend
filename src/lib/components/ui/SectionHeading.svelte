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
		<span
			class="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-[#96392C] uppercase {align ===
			'center'
				? 'justify-center'
				: ''}"
		>
			<span class="h-px w-5 bg-[#96392C]/50"></span>
			{eyebrow}
		</span>
	{/if}
	<h2 class="mt-3 font-['Instrument_Serif'] text-3xl text-[#172420] italic sm:text-4xl">{title}</h2>
	{#if subtitle}
		<p class="mt-3 max-w-md text-[#46605A] {align === 'center' ? 'mx-auto' : ''}">{subtitle}</p>
	{/if}
</div>