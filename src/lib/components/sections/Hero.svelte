<script lang="ts">
	import { userStore } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import { openLoginModal, openRegisterModal } from '$lib/stores/modalStore';

	let { title, description }: { title?: string; description?: string } = $props();
</script>

<section class="relative overflow-hidden bg-[#ECF0E9]">
	<div
		class="pointer-events-none absolute -top-[10%] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(198,137,88,0.16),_transparent_70%)]"
		aria-hidden="true"
	></div>

	<svg
		viewBox="0 0 1000 420"
		preserveAspectRatio="none"
		class="pointer-events-none absolute inset-0 h-full w-full text-[#172420]/[0.07]"
		aria-hidden="true"
	>
		<path
			class="hero-line"
			d="M-50,340 C120,180 200,420 340,260 C460,120 520,340 640,200 C760,60 840,260 1050,90"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		/>
	</svg>

	<div class="relative mx-auto max-w-2xl px-4 pt-20 pb-14 text-center sm:pt-28 sm:pb-20">
		<div class="flex flex-wrap items-center justify-center gap-3">
			<span
				class="inline-flex items-center gap-2 rounded-full border border-[#172420]/10 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#96392C] uppercase backdrop-blur-sm"
			>
				Booking gjort enkelt
			</span>

			{#if $userStore}
				<span class="text-[13px] text-[#46605A]">
					Velkommen tilbage, <strong class="font-semibold text-[#172420]">{$userStore.email}</strong>
				</span>
			{:else}
				<button
					onclick={openLoginModal}
					class="text-[13px] tracking-wide text-[#46605A] underline decoration-[#46605A]/30 underline-offset-4 transition hover:text-[#172420] hover:decoration-[#172420]/40"
				>
					Log ind
				</button>
			{/if}
		</div>

		{#if title}
			<div class="mt-8 font-['Instrument_Serif'] text-[2.75rem] leading-[1.05] text-[#172420] italic sm:text-6xl">
				{@html title}
			</div>
		{:else}
			<h1 class="mt-8 font-['Instrument_Serif'] text-[2.75rem] leading-[1.05] text-[#172420] italic sm:text-6xl">
				Find en tid,<br class="hidden sm:block" /> der passer dig.
			</h1>
		{/if}

		<p class="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#46605A] sm:text-lg">
			{description ??
				'Se ledige tider i realtid, og book direkte online — hurtigt, enkelt og uden ventetid.'}
		</p>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-6">
			<Button href="/book" size="lg">
				Se ledige tider
				<svg
					viewBox="0 0 16 16"
					class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M2 8h11M9 3l5 5-5 5"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</Button>

			{#if !$userStore}
				<button
					onclick={openRegisterModal}
					class="text-[13px] tracking-wide text-[#46605A] underline decoration-[#46605A]/30 underline-offset-4 transition hover:text-[#172420] hover:decoration-[#172420]/40"
				>
					Opret en konto
				</button>
			{/if}
		</div>
	</div>
</section>

<style>
	.hero-line {
		stroke-dasharray: 1400;
		stroke-dashoffset: 1400;
		animation: draw 2.4s ease-out forwards;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-line {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>