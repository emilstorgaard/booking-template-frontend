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
	class="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium tracking-tight transition
		{active ? 'bg-[#172420] text-[#ECF0E9]' : 'text-[#46605A] hover:bg-[#172420]/6'}"
>
	{@render children?.()}
</a>