<script lang="ts">
	let { tone = 'light', class: className = '' }: { tone?: 'light' | 'dark'; class?: string } =
		$props();
</script>

<div class="wave-wrap relative {className}" aria-hidden="true">
	<div class="wave-track">
		<svg viewBox="0 0 1440 100" preserveAspectRatio="none" class="h-full w-[200%]">
			{#if tone === 'light'}
				<path
					d="M0,55 C120,20 240,90 360,55 C480,20 600,90 720,55 C840,20 960,90 1080,55 C1200,20 1320,90 1440,55 L1440,100 L0,100 Z M1440,55 C1560,20 1680,90 1800,55 C1920,20 2040,90 2160,55 C2280,20 2400,90 2520,55 C2640,20 2760,90 2880,55 L2880,100 L1440,100 Z"
					class="fill-tide/10"
				/>
				<path
					d="M0,60 C120,30 240,85 360,60 C480,30 600,85 720,60 C840,30 960,85 1080,60 C1200,30 1320,85 1440,60"
					class="stroke-[#E08E45]/50"
					fill="none"
					stroke-width="2"
				/>
				<path
					d="M1440,60 C1560,30 1680,85 1800,60 C1920,30 2040,85 2160,60 C2280,30 2400,85 2520,60 C2640,30 2760,85 2880,60"
					class="stroke-[#E08E45]/50"
					fill="none"
					stroke-width="2"
				/>
			{:else}
				<path
					d="M0,55 C120,20 240,90 360,55 C480,20 600,90 720,55 C840,20 960,90 1080,55 C1200,20 1320,90 1440,55 L1440,0 L0,0 Z M1440,55 C1560,20 1680,90 1800,55 C1920,20 2040,90 2160,55 C2280,20 2400,90 2520,55 C2640,20 2760,90 2880,55 L2880,0 L1440,0 Z"
					class="fill-white/10"
				/>
			{/if}
		</svg>
	</div>
</div>

<style>
	.wave-wrap {
		overflow: hidden;
	}
	.wave-track {
		display: flex;
		width: 200%;
		animation: drift 22s linear infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.wave-track {
			animation: none;
		}
	}
	@keyframes drift {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
</style>