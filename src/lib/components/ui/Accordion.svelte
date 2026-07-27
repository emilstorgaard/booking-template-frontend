<script lang="ts">
	import type { FaqItem } from '$lib/types/content';

	let { items }: { items: FaqItem[] } = $props();
	let openId = $state<string | null>(items[0]?.id ?? null);

	function toggle(id: string) {
		openId = openId === id ? null : id;
	}
</script>

<div class="space-y-3">
	{#each items as item (item.id)}
		<div class="overflow-hidden rounded-[24px] border border-[#172420]/8 bg-white">
			<h3>
				<button
					type="button"
					onclick={() => toggle(item.id)}
					aria-expanded={openId === item.id}
					aria-controls={`faq-panel-${item.id}`}
					class="flex w-full items-center gap-4 px-6 py-4.5 text-left transition hover:bg-[#172420]/[0.02]"
				>
					<span class="flex-1 text-[15px] font-medium text-[#172420]">{item.question}</span>
					<span
						class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors {openId === item.id
							? 'bg-[#96392C] text-white'
							: 'bg-[#172420]/5 text-[#46605A]'}"
					>
						<svg
							class="h-3.5 w-3.5 transition-transform duration-200 {openId === item.id ? 'rotate-180' : ''}"
							viewBox="0 0 20 20"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M5 7.5l5 5 5-5"
								stroke="currentColor"
								stroke-width="1.6"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</button>
			</h3>
			{#if openId === item.id}
				<div id={`faq-panel-${item.id}`} class="px-6 pt-0 pb-5 text-sm leading-relaxed text-[#46605A]">
					{item.answer}
				</div>
			{/if}
		</div>
	{/each}
</div>