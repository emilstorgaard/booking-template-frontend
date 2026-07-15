<script lang="ts">
	import { onMount } from 'svelte';

	let { title = 'Title', onclose, children } = $props();

	let panelEl = $state<HTMLElement | null>(null);

	function close() {
		if (onclose) onclose();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) close();
	}

	onMount(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
		};
		document.addEventListener('keydown', handleKeydown);

		panelEl?.focus();

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div
	class="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
	onclick={handleBackdropClick}
	role="presentation"
>
	<div
		bind:this={panelEl}
		class="w-full max-w-md rounded-2xl border border-white/10 bg-[#14201c] text-[#f2ede1] shadow-2xl outline-none"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div class="flex items-center justify-between px-6 py-5 sm:px-8">
			<h1 id="modal-title" class="text-xl font-semibold tracking-tight md:text-2xl">
				{title}
			</h1>
			<button
				title="Close"
				onclick={close}
				aria-label="Close"
				class="flex h-9 w-9 items-center justify-center rounded-full text-[#f2ede1]/70 transition hover:bg-white/10 hover:text-[#f2ede1]"
			>
				<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>

		<div class="space-y-4 px-6 pb-6 sm:px-8 sm:pb-8 md:space-y-6">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>
