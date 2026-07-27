<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		onclick,
		class: className = '',
		children
	}: {
		href?: string;
		variant?: 'primary' | 'secondary' | 'ghost' | 'inverse';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		class?: string;
		children?: Snippet;
	} = $props();

	const variants = {
		primary: 'bg-[#172420] text-[#ECF0E9] hover:bg-[#46605A]',
		secondary: 'bg-[#96392C] text-white hover:bg-[#7e2f24]',
		ghost: 'bg-transparent text-[#172420] hover:bg-[#172420]/5',
		inverse: 'bg-[#ECF0E9] text-[#172420] hover:bg-white'
	};

	const sizes = {
		sm: 'px-5 py-2 text-[13px]',
		md: 'px-6 py-2.5 text-sm',
		lg: 'px-8 py-3.5 text-base'
	};

	const base =
		'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(23,36,32,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#96392C] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none';
</script>

{#if href}
	<a {href} class="{base} {variants[variant]} {sizes[size]} {className}">
		{@render children?.()}
	</a>
{:else}
	<button {type} {disabled} {onclick} class="{base} {variants[variant]} {sizes[size]} {className}">
		{@render children?.()}
	</button>
{/if}