<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getUserById, adminDeleteUser, type User } from '$lib/api/user';
	import { getBookingsByUser, adminCancelBooking, type TimeSlot } from '$lib/api/booking';
	import { triggerToast } from '$lib/stores/toastStore';
	import Card from '$lib/components/ui/Card.svelte';
	import MovementLine from '$lib/components/ui/MovementLine.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	const userId = $derived(Number($page.params.id));

	let user = $state<User | null>(null);
	let bookings = $state<TimeSlot[]>([]);
	let loadingUser = $state(true);
	let loadingBookings = $state(true);
	let pendingCancelId = $state<number | null>(null);
	let isDeleting = $state(false);
	let showDeleteConfirm = $state(false);

	async function loadUser() {
		loadingUser = true;
		try {
			user = await getUserById(userId);
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke hente brugeren.', 'error');
		} finally {
			loadingUser = false;
		}
	}

	async function loadBookings() {
		loadingBookings = true;
		try {
			bookings = await getBookingsByUser(userId);
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke hente bookinger.', 'error');
		} finally {
			loadingBookings = false;
		}
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('da-DK', {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		});
	}

	function formatTimeRange(startIso: string, endIso: string) {
		const start = new Date(startIso).toLocaleTimeString('da-DK', {
			hour: '2-digit',
			minute: '2-digit'
		});
		const end = new Date(endIso).toLocaleTimeString('da-DK', {
			hour: '2-digit',
			minute: '2-digit'
		});
		return `${start} – ${end}`;
	}

	const upcomingBookings = $derived(
		[...bookings].sort(
			(a, b) => new Date(a.startTimeUtc).getTime() - new Date(b.startTimeUtc).getTime()
		)
	);

	onMount(() => {
		loadUser();
		loadBookings();
	});

	async function handleCancelBooking(slot: TimeSlot) {
		pendingCancelId = slot.id;
		try {
			await adminCancelBooking(slot.id);
			triggerToast('Bookingen er aflyst.', 'success');
			await loadBookings();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke aflyse booking.', 'error');
		} finally {
			pendingCancelId = null;
		}
	}

	async function handleDeleteUser() {
		isDeleting = true;
		try {
			await adminDeleteUser(userId);
			triggerToast('Brugeren er slettet.', 'success');
			await goto('/admin/users');
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke slette brugeren.', 'error');
		} finally {
			isDeleting = false;
			showDeleteConfirm = false;
		}
	}
</script>

<svelte:head>
	<title>{user ? user.email : 'Bruger'} · Admin</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 pt-16 pb-10 sm:pt-24 sm:pb-14">
	<a
		href="/admin/users"
		class="inline-flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.1em] text-[#46605A] uppercase transition hover:text-[#96392C]"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-3.5 w-3.5">
			<path
				d="M19 12H5M5 12L11 6M5 12L11 18"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		Alle brugere
	</a>

	{#if loadingUser}
		<div class="mt-8 flex items-center gap-2 text-sm text-[#46605A]">
			<Spinner class="h-4 w-4 text-[#96392C]" />
			Henter bruger…
		</div>
	{:else if user}
		<h1
			class="mt-5 font-['Instrument_Serif'] text-4xl leading-[1.1] text-[#172420] italic break-all sm:text-5xl"
		>
			{user.email}
		</h1>
	{:else}
		<p class="mt-8 text-sm text-[#46605A]">Brugeren blev ikke fundet.</p>
	{/if}
</div>

{#if user}
	<section class="bg-[#ECF0E9] px-4 pt-2 pb-24">
		<div class="mx-auto max-w-3xl">
			<div class="max-w-md">
				<span class="text-[11px] font-semibold tracking-[0.24em] text-[#96392C] uppercase">
					Bookinger
				</span>
				<h2 class="mt-3 font-['Instrument_Serif'] text-3xl text-[#172420] italic sm:text-4xl">
					Bookede tider
				</h2>
			</div>

			<div class="mt-6 max-w-xs text-[#172420]/15">
				<MovementLine />
			</div>

			{#if loadingBookings}
				<div class="mt-8 flex items-center gap-2 text-sm text-[#46605A]">
					<Spinner class="h-4 w-4 text-[#96392C]" />
					Henter bookinger…
				</div>
			{:else if upcomingBookings.length === 0}
				<div class="mt-8">
					<Card>
						<p class="py-6 text-center text-sm text-[#46605A]">
							Denne bruger har ingen bookede tider.
						</p>
					</Card>
				</div>
			{:else}
				<ol class="mt-8 space-y-4">
					{#each upcomingBookings as slot (slot.id)}
						<li>
							<Card>
								<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<p class="font-['Instrument_Serif'] text-xl text-[#172420] italic capitalize">
											{formatDate(slot.startTimeUtc)}
										</p>
										<p class="mt-1 text-sm text-[#46605A]">
											{formatTimeRange(slot.startTimeUtc, slot.endTimeUtc)}
										</p>
										{#if slot.notes}
											<p class="mt-2 text-sm text-[#46605A]/80">{slot.notes}</p>
										{/if}
									</div>

									<button
										onclick={() => handleCancelBooking(slot)}
										disabled={pendingCancelId === slot.id}
										class="shrink-0 rounded-full border border-[#96392C]/25 px-5 py-2.5 text-sm font-semibold text-[#96392C] transition hover:bg-[#96392C]/5 disabled:cursor-not-allowed disabled:opacity-50"
									>
										{#if pendingCancelId === slot.id}
											<Spinner class="mr-1 inline h-3.5 w-3.5" />
										{/if}
										{pendingCancelId === slot.id ? 'Aflyser…' : 'Aflys tid'}
									</button>
								</div>
							</Card>
						</li>
					{/each}
				</ol>
			{/if}

			<div class="mt-16 max-w-md">
				<span class="text-[11px] font-semibold tracking-[0.24em] text-[#96392C] uppercase">
					Fare-zone
				</span>
				<h2 class="mt-3 font-['Instrument_Serif'] text-3xl text-[#172420] italic sm:text-4xl">
					Slet bruger
				</h2>
			</div>

			<div class="mt-6 max-w-xs text-[#172420]/15">
				<MovementLine />
			</div>

			<div class="mt-8">
				<Card>
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<p class="text-sm text-[#46605A]">
							Sletter du brugeren, frigives alle deres bookede tider, og handlingen kan ikke
							fortrydes.
						</p>

						{#if showDeleteConfirm}
							<div class="flex shrink-0 gap-2">
								<button
									onclick={handleDeleteUser}
									disabled={isDeleting}
									class="rounded-full bg-[#96392C] px-5 py-2.5 text-sm font-semibold text-[#ECF0E9] transition hover:bg-[#96392C]/85 disabled:opacity-50"
								>
									{isDeleting ? 'Sletter…' : 'Ja, slet bruger'}
								</button>
								<button
									onclick={() => (showDeleteConfirm = false)}
									disabled={isDeleting}
									class="rounded-full border border-[#172420]/12 px-5 py-2.5 text-sm text-[#46605A] transition hover:bg-[#172420]/5"
								>
									Annullér
								</button>
							</div>
						{:else}
							<button
								onclick={() => (showDeleteConfirm = true)}
								class="shrink-0 rounded-full border border-[#96392C]/25 px-5 py-2.5 text-sm font-semibold text-[#96392C] transition hover:bg-[#96392C]/5"
							>
								Slet bruger
							</button>
						{/if}
					</div>
				</Card>
			</div>
		</div>
	</section>
{/if}
