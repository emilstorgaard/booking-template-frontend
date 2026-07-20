<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { userStore } from '$lib/stores/auth';

	let { data } = $props();

	const p = $derived(data.page.properties);

	const steps = [
		{
			n: '01',
			title: 'Vælg en dag',
			text: 'Se de kommende uger i kalenderen, og find en dag der passer dig.'
		},
		{
			n: '02',
			title: 'Vælg et tidspunkt',
			text: 'Klik på et af de ledige tidspunkter den dag – kun åbne tider vises.'
		},
		{
			n: '03',
			title: 'Bekræft',
			text: 'Bekræft bookingen med ét klik. Du kan altid afbestille igen senere.'
		}
	];

	const features = [
		{
			title: 'Altid opdateret',
			text: 'Kalenderen viser kun tider der reelt er ledige, lige nu.'
		},
		{
			title: 'Bekræftelse med det samme',
			text: 'Så snart du booker, er tiden din — ingen ventetid på svar.'
		},
		{
			title: 'Nem afbestilling',
			text: 'Fortryd eller flyt din tid selv, direkte fra din profil.'
		}
	];
</script>

<SeoHead seo={p} />

<div class="overflow-hidden">
	<!-- HERO -->
	<section class="relative bg-gradient-to-b from-tide/5 via-white to-white">
		<div class="mx-auto max-w-3xl px-4 pt-16 pb-8 sm:pt-24 sm:pb-12">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<span
					class="inline-flex items-center gap-1.5 rounded-full bg-tide/10 px-3 py-1 text-xs font-medium tracking-wide text-tide uppercase"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-tide"></span>
					Booking
				</span>

				{#if $userStore}
					<span class="text-sm text-slate-500">
						Logget ind som <strong class="font-medium text-slate-700">{$userStore.email}</strong>
					</span>
				{:else}
					<a href="/login" class="text-sm font-medium text-slate-500 transition hover:text-tide">
						Log ind →
					</a>
				{/if}
			</div>

			{#if p?.title}
				<div class="font-display mt-6 text-4xl leading-tight font-semibold text-slate-900 sm:text-5xl">
					{@html p.title}
				</div>
			{:else}
				<h1 class="font-display mt-6 text-4xl leading-tight font-semibold text-slate-900 sm:text-5xl">
					Find en tid, der<br class="hidden sm:block" /> passer dig.
				</h1>
			{/if}

			<p class="mt-5 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
				{p?.title ?? 'Se de ledige tider i kalenderen, og book på under et minut. Ingen opkald, ingen ventetid.'}
			</p>

			<div class="mt-8 flex flex-wrap items-center gap-4">
				<a
					href="/book"
					class="inline-flex items-center gap-2 rounded-full bg-tide px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-tide/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tide"
				>
					Se ledige tider
					<svg viewBox="0 0 16 16" class="h-3.5 w-3.5" fill="none" aria-hidden="true">
						<path d="M2 8h11M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</a>

				{#if !$userStore}
					<a href="/register" class="text-sm font-medium text-slate-500 transition hover:text-slate-800">
						Opret en konto
					</a>
				{/if}
			</div>
		</div>

		<!-- SIGNATUR: bølgelinjen -->
		<div class="wave-wrap relative h-16 sm:h-24" aria-hidden="true">
			<div class="wave-track">
				<svg viewBox="0 0 1440 100" preserveAspectRatio="none" class="h-full w-[200%]">
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
				</svg>
			</div>
		</div>
	</section>

	<!-- SÅDAN BOOKER DU -->
	<section class="mx-auto max-w-3xl px-4 py-10 sm:py-14">
		<h2 class="text-xs font-semibold tracking-wide text-slate-400 uppercase">Sådan foregår det</h2>
		<ol class="mt-6 grid gap-8 sm:grid-cols-3 sm:gap-6">
			{#each steps as step}
				<li>
					<span class="font-mono text-sm text-tide">{step.n}</span>
					<h3 class="font-display mt-2 text-lg font-medium text-slate-900">{step.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-slate-600">{step.text}</p>
				</li>
			{/each}
		</ol>
	</section>

	<!-- FORDELE -->
	<section class="border-t border-slate-100 bg-slate-50/60">
		<div class="mx-auto max-w-3xl px-4 py-10 sm:py-14">
			<div class="grid gap-5 sm:grid-cols-3">
				{#each features as feature}
					<div class="rounded-2xl border border-slate-200 bg-white p-5">
						<h3 class="text-sm font-semibold text-slate-900">{feature.title}</h3>
						<p class="mt-1.5 text-sm leading-relaxed text-slate-500">{feature.text}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- AFSLUTTENDE CTA -->
	<section class="relative overflow-hidden bg-tide">
		<div class="wave-wrap absolute inset-x-0 top-0 h-16 -translate-y-1 opacity-40 sm:h-24" aria-hidden="true">
			<div class="wave-track">
				<svg viewBox="0 0 1440 100" preserveAspectRatio="none" class="h-full w-[200%]">
					<path
						d="M0,55 C120,20 240,90 360,55 C480,20 600,90 720,55 C840,20 960,90 1080,55 C1200,20 1320,90 1440,55 L1440,0 L0,0 Z M1440,55 C1560,20 1680,90 1800,55 C1920,20 2040,90 2160,55 C2280,20 2400,90 2520,55 C2640,20 2760,90 2880,55 L2880,0 L1440,0 Z"
						class="fill-white/10"
					/>
				</svg>
			</div>
		</div>

		<div class="relative mx-auto max-w-3xl px-4 py-14 text-center sm:py-20">
			<h2 class="font-display text-2xl font-semibold text-white sm:text-3xl">
				Klar til at booke din tid?
			</h2>
			<p class="mx-auto mt-3 max-w-md text-sm text-white/80 sm:text-base">
				Det tager under et minut, og du kan altid ændre den igen senere.
			</p>
			<a
				href="/book"
				class="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-tide shadow-sm transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
			>
				Se ledige tider
			</a>
		</div>
	</section>
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