<script lang="ts">
	import type { Snippet } from 'svelte';
	let { class: className = '', children }: { class?: string; children?: Snippet } = $props();
</script>

<div
	class="rounded-[28px] border border-[#172420]/8 bg-white p-7 shadow-[0_25px_60px_-35px_rgba(23,36,32,0.35)] {className}"
>
	{@render children?.()}
</div>