<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { userStore } from '$lib/stores/auth';
	import { triggerToast } from '$lib/stores/toastStore';
	import { openLoginModal } from '$lib/stores/modalStore';

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

	function parseAsUtc(iso: string): Date {
		const hasTimezoneInfo = /Z$|[+-]\d{2}:?\d{2}$/.test(iso);
		return new Date(hasTimezoneInfo ? iso : `${iso}Z`);
	}

	function formatTime(iso: string): string {
		return parseAsUtc(iso).toLocaleString('da-DK', {
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
			<div class="mb-10 overflow-hidden rounded-[28px] border border-[#172420]/8 bg-white shadow-[0_15px_40px_-25px_rgba(23,36,32,0.25)]">
				<div class="flex items-center justify-between border-b border-[#172420]/6 px-6 py-4">
					<p class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.2em] text-[#96392C] uppercase">
						Mine bookinger
					</p>
					<span class="font-['IBM_Plex_Mono'] text-[10px] text-[#46605A]/60">{myBookings.length} aktiv{myBookings.length === 1 ? '' : 'e'}</span>
				</div>
				<ul class="divide-y divide-[#172420]/5">
					{#each myBookings as slot (slot.id)}
						<li class="flex items-center justify-between gap-4 px-6 py-4">
							<div class="min-w-0">
								<p class="truncate text-sm font-medium text-[#172420] capitalize">
									{new Date(slot.startTimeUtc + (slot.startTimeUtc.endsWith('Z') ? '' : 'Z')).toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' })}
								</p>
								<p class="mt-0.5 font-['IBM_Plex_Mono'] text-xs text-[#46605A]">{formatTime(slot.startTimeUtc)}</p>
							</div>
							<button
								class="shrink-0 rounded-full border border-[#96392C]/20 px-4 py-1.5 font-['IBM_Plex_Mono'] text-[11px] font-semibold text-[#96392C] transition hover:border-[#96392C]/40 hover:bg-[#96392C]/5 disabled:opacity-50"
								disabled={pendingId === slot.id}
								onclick={() => handleCancel(slot)}
							>
								{#if pendingId === slot.id}
									<Spinner class="mr-1 inline h-3 w-3" />
								{/if}
								{pendingId === slot.id ? 'Aflyser…' : 'Aflys'}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="mb-6 flex items-center justify-between gap-4">
			<p class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.2em] text-[#96392C] uppercase">Ledige tider</p>
			{#if !$userStore}
				<button
					onclick={openLoginModal}
					class="rounded-full border border-[#172420]/12 px-4 py-1.5 text-xs font-semibold text-[#172420] transition hover:bg-[#172420]/5"
				>
					Log ind for at booke
				</button>
			{/if}
		</div>

		{#if loading}
			<div class="space-y-3">
				{#each [1, 2] as _}
					<div class="h-20 animate-pulse rounded-[28px] bg-[#172420]/5"></div>
				{/each}
			</div>
		{:else if availableSlots.length === 0}
			<div class="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-[#172420]/15 py-16 text-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#172420]/6 text-[#172420]/30">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
						<rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" stroke-width="1.6" />
						<path d="M3.5 9.5H20.5" stroke="currentColor" stroke-width="1.6" />
					</svg>
				</div>
				<p class="text-sm text-[#46605A]">Der er ingen ledige tider lige nu — kig forbi igen snart.</p>
			</div>
		{:else}
			<BookingCalendar slots={availableSlots} {pendingId} onBook={handleBook} />
		{/if}
	</div>
</section>