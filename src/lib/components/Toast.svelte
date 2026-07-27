<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import { fly } from 'svelte/transition';

	const styles = {
		success: 'bg-[#46605A] border-[#46605A]',
		error: 'bg-[#96392C] border-[#96392C]',
		info: 'bg-[#172420] border-[#172420]'
	};

	const labels = {
		success: 'Bekræftet',
		error: 'Fejl',
		info: 'Info'
	};
</script>

{#if $toastStore.visible}
	<div
		transition:fly={{ y: 20, duration: 200 }}
		class="fixed right-6 bottom-6 z-200 max-w-sm rounded-2xl border px-5 py-4 text-[#ECF0E9] shadow-[0_20px_50px_-20px_rgba(23,36,32,0.5)] {styles[
			$toastStore.type
		]}"
		role="status"
		aria-live="polite"
	>
		<span class="block text-[11px] font-semibold tracking-[0.1em] text-[#ECF0E9]/70 uppercase">
			{labels[$toastStore.type]}
		</span>
		<p class="mt-1 text-sm font-medium">{$toastStore.message}</p>
	</div>
{/if}