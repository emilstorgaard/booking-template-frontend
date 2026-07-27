<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { userStore } from '$lib/stores/auth';
	import { triggerToast } from '$lib/stores/toastStore';

	let { data } = $props();

	const p = $derived(data.page.properties);

	import { onMount } from 'svelte';
	import {
		getAvailableSlots,
		getMyBookings,
		bookSlot,
		cancelBooking,
		type TimeSlot
	} from '$lib/api/booking';
	import BookingCalendar from '$lib/components/BookingCalendar.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let availableSlots = $state<TimeSlot[]>([]);
	let myBookings = $state<TimeSlot[]>([]);
	let loading = $state(true);
	let pendingId = $state<number | null>(null);

	async function loadAvailableSlots() {
		try {
			availableSlots = await getAvailableSlots();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke hente ledige tider.', 'error');
		}
	}

	async function loadMyBookings() {
		if (!$userStore) {
			myBookings = [];
			return;
		}
		try {
			myBookings = await getMyBookings();
		} catch (err) {
			triggerToast(
				err instanceof Error ? err.message : 'Kunne ikke hente dine bookinger.',
				'error'
			);
		}
	}

	async function loadData() {
		loading = true;
		await Promise.all([loadAvailableSlots(), loadMyBookings()]);
		loading = false;
	}

	async function handleBook(slot: TimeSlot) {
		if (!$userStore) {
			triggerToast('Du skal være logget ind for at booke en tid.', 'error');
			return;
		}

		pendingId = slot.id;
		try {
			await bookSlot(slot.id);
			triggerToast(`Du har booket tiden ${formatTime(slot.startTimeUtc)}.`, 'success');
			await loadData();
		} catch (err) {
			// Backend returnerer 409 hvis en anden bruger nåede tiden først
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke booke tiden.', 'error');
		} finally {
			pendingId = null;
		}
	}

	async function handleCancel(slot: TimeSlot) {
		pendingId = slot.id;
		try {
			await cancelBooking(slot.id);
			triggerToast('Din booking er aflyst.', 'success');
			await loadData();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke aflyse booking.', 'error');
		} finally {
			pendingId = null;
		}
	}

	function formatTime(iso: string): string {
		return new Date(iso).toLocaleString('da-DK', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	onMount(loadData);

	$effect(() => {
		$userStore; // registrerer afhængigheden
		loadMyBookings();
	});
</script>

<SeoHead seo={p} />

<div class="relative overflow-hidden bg-[#ECF0E9]">
	<div
		class="pointer-events-none absolute -top-[20%] right-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(198,137,88,0.12),_transparent_70%)]"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-2xl px-4 pt-20 pb-12 sm:pt-28 sm:pb-16">
		<span class="inline-flex items-center gap-2 rounded-full border border-[#172420]/10 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#96392C] uppercase backdrop-blur-sm">
			Book en tid
		</span>

		<h1 class="mt-7 font-['Instrument_Serif'] text-4xl leading-[1.1] text-[#172420] italic sm:text-5xl">
			Find en ledig tid
		</h1>

		<p class="mt-6 max-w-xl text-base leading-relaxed text-[#46605A] sm:text-lg">
			Vælg en markeret dag i kalenderen for at se ledige tider, og book direkte online.
		</p>
	</div>
</div>

<section class="bg-[#ECF0E9] px-4 pt-2 pb-20 sm:pb-24">
	<div class="mx-auto max-w-3xl">
		{#if $userStore && myBookings.length > 0}
			<div class="mb-10">
				<h2 class="text-[11px] font-semibold tracking-[0.24em] text-[#96392C] uppercase">Mine bookinger</h2>
				<ul class="mt-4 grid gap-3 sm:grid-cols-2">
					{#each myBookings as slot (slot.id)}
						<li
							class="flex items-center justify-between gap-3 rounded-full border border-[#172420]/8 bg-white px-5 py-3 shadow-[0_15px_40px_-25px_rgba(23,36,32,0.35)]"
						>
							<span class="text-sm text-[#172420] capitalize">{formatTime(slot.startTimeUtc)}</span>
							<button
								class="shrink-0 rounded-full border border-[#172420]/12 px-3.5 py-1.5 text-[13px] text-[#46605A] transition hover:border-[#96392C]/40 hover:bg-[#96392C]/5 hover:text-[#96392C] disabled:opacity-50"
								disabled={pendingId === slot.id}
								onclick={() => handleCancel(slot)}
							>
								{#if pendingId === slot.id}
									<Spinner class="mr-1 inline h-3.5 w-3.5" />
								{/if}
								{pendingId === slot.id ? 'Aflyser…' : 'Aflys'}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="flex items-baseline justify-between">
			<h2 class="text-[11px] font-semibold tracking-[0.24em] text-[#96392C] uppercase">Ledige tider</h2>
			{#if !$userStore}
				<p class="text-[11px] tracking-wide text-[#46605A]/70 uppercase">Log ind for at booke</p>
			{/if}
		</div>

		{#if loading}
			<div class="mt-5 flex items-center gap-2 text-sm text-[#46605A]">
				<Spinner class="h-4 w-4 text-[#96392C]" />
				Henter tider…
			</div>
		{:else if availableSlots.length === 0}
			<p class="mt-5 text-sm text-[#46605A]">Der er ingen ledige tider lige nu — kig forbi igen snart.</p>
		{:else}
			<div class="mt-4">
				<BookingCalendar slots={availableSlots} {pendingId} onBook={handleBook} />
			</div>
		{/if}
	</div>
</section>