<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		active,
		onclick,
		class: className = '',
		children
	}: {
		href: string;
		active: boolean;
		onclick?: () => void;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<a
	{href}
	{onclick}
	aria-current={active ? 'page' : undefined}
	class="group relative rounded-full px-5 py-2.5 text-base font-semibold transition-all duration-200 hover:bg-brand-50 hover:text-brand-600
		{active ? 'bg-brand-50 text-brand-600' : 'text-gray-600'} {className}"
>
	{@render children?.()}
	<span
		class="absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-brand-500 transition-all duration-300
			{active ? 'w-4/5' : 'w-0 group-hover:w-4/5'}"
	></span>
</a>