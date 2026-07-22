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
		primary: 'bg-tide text-white hover:bg-tide/90 shadow-sm',
		secondary: 'bg-brand-500 text-white hover:bg-brand-400 shadow-sm',
		ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
		inverse: 'bg-white text-tide hover:bg-white/90 shadow-sm'
	};

	const sizes = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-sm',
		lg: 'px-7 py-3.5 text-base'
	};

	const base =
		'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tide disabled:cursor-not-allowed disabled:opacity-50';
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