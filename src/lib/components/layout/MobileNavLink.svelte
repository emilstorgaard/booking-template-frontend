<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		active,
		onclick,
		children
	}: {
		href: string;
		active: boolean;
		onclick?: () => void;
		children?: Snippet;
	} = $props();
</script>

<a
	{href}
	{onclick}
	aria-current={active ? 'page' : undefined}
	class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition hover:bg-brand-50 hover:text-brand-600
		{active ? 'bg-brand-50 text-brand-600' : 'text-gray-700'}"
>
	<span
		class="h-1.5 w-1.5 rounded-full transition-all
			{active ? 'scale-150 bg-brand-600' : 'bg-brand-400'}"
	></span>
	{@render children?.()}
</a>