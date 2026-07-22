<script lang="ts">
	import type { Snippet } from 'svelte';
	let { class: className = '', children }: { class?: string; children?: Snippet } = $props();
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm {className}">
	{@render children?.()}
</div>