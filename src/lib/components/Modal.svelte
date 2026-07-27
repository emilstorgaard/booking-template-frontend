<script lang="ts">
	import { onMount } from 'svelte';
	import MovementLine from '$lib/components/ui/MovementLine.svelte';

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
	class="fixed inset-0 z-100 flex items-center justify-center bg-[#172420]/70 p-4 backdrop-blur-sm"
	onclick={handleBackdropClick}
	role="presentation"
>
	<div
		bind:this={panelEl}
		class="w-full max-w-md overflow-hidden rounded-[28px] border border-[#172420]/8 bg-white text-[#172420] shadow-[0_30px_70px_-25px_rgba(23,36,32,0.55)] outline-none"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div class="flex items-center justify-between px-7 pt-7 pb-4 sm:px-9">
			<h1 id="modal-title" class="font-['Instrument_Serif'] text-2xl text-[#172420] italic md:text-[28px]">
				{title}
			</h1>
			<button
				title="Luk"
				onclick={close}
				aria-label="Luk"
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#46605A] transition hover:bg-[#172420]/6 hover:text-[#172420]"
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

		<div class="px-7 text-[#172420]/10 sm:px-9">
			<MovementLine class="h-3" />
		</div>

		<div class="space-y-5 px-7 pt-5 pb-8 sm:px-9">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>