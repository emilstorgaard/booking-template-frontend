<script lang="ts">
	let { rating = 5 }: { rating?: number } = $props();
</script>

<div class="flex gap-0.5 text-tide" aria-label={`${rating} ud af 5 stjerner`}>
	{#each Array(5) as _, i}
		<svg
			viewBox="0 0 20 20"
			class="h-4 w-4"
			fill={i < rating ? 'currentColor' : 'none'}
			stroke="currentColor"
			stroke-width="1.2"
			aria-hidden="true"
		>
			<path
				d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85z"
			/>
		</svg>
	{/each}
</div>