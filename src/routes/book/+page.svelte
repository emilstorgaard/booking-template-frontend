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

<div class="mx-auto max-w-3xl px-4 py-12 sm:py-16">
	<h1 class="text-3xl font-semibold text-slate-900 sm:text-4xl">Book en tid</h1>
	<p class="mt-2 text-slate-500">Vælg en markeret dag i kalenderen for at se ledige tider.</p>

	{#if $userStore && myBookings.length > 0}
		<section class="mt-10">
			<h2 class="text-xs font-semibold tracking-wide text-slate-400 uppercase">Mine bookinger</h2>
			<ul class="mt-3 grid gap-2 sm:grid-cols-2">
				{#each myBookings as slot (slot.id)}
					<li
						class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
					>
						<span class="text-sm text-slate-700">{formatTime(slot.startTimeUtc)}</span>
						<button
							class="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
							disabled={pendingId === slot.id}
							onclick={() => handleCancel(slot)}
						>
							{#if pendingId === slot.id}
								<Spinner class="h-3.5 w-3.5" />
							{/if}
							{pendingId === slot.id ? 'Aflyser…' : 'Aflys'}
						</button>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section class="mt-10">
		<div class="flex items-baseline justify-between">
			<h2 class="text-xs font-semibold tracking-wide text-slate-400 uppercase">Ledige tider</h2>
			{#if !$userStore}
				<p class="text-xs text-slate-400">Log ind for at booke</p>
			{/if}
		</div>

		{#if loading}
			<div class="mt-4 flex items-center gap-2 text-sm text-slate-500">
				<Spinner class="h-4 w-4 text-brand-500" />
				Henter tider…
			</div>
		{:else if availableSlots.length === 0}
			<p class="mt-4 text-sm text-slate-500">Ingen ledige tider lige nu.</p>
		{:else}
			<div class="mt-3">
				<BookingCalendar slots={availableSlots} {pendingId} onBook={handleBook} />
			</div>
		{/if}
	</section>
</div>
