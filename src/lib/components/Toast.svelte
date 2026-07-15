<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import { fly } from 'svelte/transition';

	const styles = {
		success: 'bg-[#2e625c] border-[#2e625c]',
		error: 'bg-[#c1602e] border-[#c1602e]',
		info: 'bg-[#14201c] border-white/10'
	};
</script>

{#if $toastStore.visible}
	<div
		transition:fly={{ y: 20, duration: 200 }}
		class="fixed bottom-6 right-6 z-200 max-w-sm rounded-xl border px-5 py-4 text-sm font-medium text-[#f2ede1] shadow-2xl {styles[
			$toastStore.type
		]}"
		role="status"
		aria-live="polite"
	>
		{$toastStore.message}
	</div>
{/if}
