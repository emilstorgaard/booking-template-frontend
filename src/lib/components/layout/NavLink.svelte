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
	class="relative rounded-full px-4 py-2 text-sm font-medium tracking-tight no-underline transition
		{active ? 'bg-[#172420] text-[#ECF0E9]' : 'text-[#46605A] hover:bg-[#172420]/6 hover:text-[#172420]'} {className}"
>
	{@render children?.()}
</a>