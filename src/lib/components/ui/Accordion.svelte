<script lang="ts">
	import type { FaqItem } from '$lib/types/content';

	let { items }: { items: FaqItem[] } = $props();
	let openId = $state<string | null>(items[0]?.id ?? null);

	function toggle(id: string) {
		openId = openId === id ? null : id;
	}
</script>

<div class="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
	{#each items as item (item.id)}
		<div>
			<h3>
				<button
					type="button"
					onclick={() => toggle(item.id)}
					aria-expanded={openId === item.id}
					aria-controls={`faq-panel-${item.id}`}
					class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-800 transition hover:text-tide"
				>
					{item.question}
					<svg
						class="h-4 w-4 shrink-0 transition-transform duration-200 {openId === item.id
							? 'rotate-180'
							: ''}"
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
				</button>
			</h3>
			{#if openId === item.id}
				<div id={`faq-panel-${item.id}`} class="px-5 pb-4 text-sm leading-relaxed text-slate-600">
					{item.answer}
				</div>
			{/if}
		</div>
	{/each}
</div>