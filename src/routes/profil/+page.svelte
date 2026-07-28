<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/auth';
	import { triggerToast } from '$lib/stores/toastStore';
	import { logout } from '$lib/utils/auth';
	import { getMyBookings, cancelBooking, type TimeSlot } from '$lib/api/booking';
	import { updateUser, deleteUser } from '$lib/api/user';
	import { setCookie } from '$lib/utils/cookies';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MovementLine from '$lib/components/ui/MovementLine.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	// ---- Bookinger ----

	let bookings = $state<TimeSlot[]>([]);
	let loading = $state(true);
	let pendingId = $state<number | null>(null);

	async function loadBookings() {
		if (!$userStore) {
			bookings = [];
			loading = false;
			return;
		}

		loading = true;
		try {
			bookings = await getMyBookings();
		} catch (err) {
			triggerToast(
				err instanceof Error ? err.message : 'Kunne ikke hente dine bookinger.',
				'error'
			);
		} finally {
			loading = false;
		}
	}

	async function handleCancel(slot: TimeSlot) {
		pendingId = slot.id;
		try {
			await cancelBooking(slot.id);
			triggerToast('Din booking er aflyst.', 'success');
			await loadBookings();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke aflyse booking.', 'error');
		} finally {
			pendingId = null;
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

	onMount(loadBookings);

	$effect(() => {
		$userStore; // registrerer afhængigheden
		loadBookings();
	});

	// ---- Konto ----

	let editedEmail = $state('');
	let isEditingEmail = $state(false);
	let isSavingEmail = $state(false);
	let isDeleting = $state(false);
	let showDeleteConfirm = $state(false);

	$effect(() => {
		if ($userStore) editedEmail = $userStore.email;
	});

	async function handleSaveEmail() {
		if (!editedEmail.trim()) {
			triggerToast('Email må ikke være tom.', 'error');
			return;
		}

		isSavingEmail = true;
		try {
			const result = await updateUser({ email: editedEmail.trim() });
			setCookie('jwt', result.token, { path: '/' });
			userStore.update((u) => (u ? { ...u, email: editedEmail.trim() } : u));
			triggerToast('Din email er opdateret.', 'success');
			isEditingEmail = false;
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke opdatere email.', 'error');
		} finally {
			isSavingEmail = false;
		}
	}

	async function handleDeleteUser() {
		isDeleting = true;
		try {
			await deleteUser();
			triggerToast('Din konto er slettet.', 'success');
			await logout();
			await goto('/');
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke slette kontoen.', 'error');
		} finally {
			isDeleting = false;
			showDeleteConfirm = false;
		}
	}
</script>

<svelte:head>
	<title>Min profil</title>
</svelte:head>

<div class="overflow-hidden bg-[#ECF0E9]">
	<section class="relative overflow-hidden">
		<div
			class="pointer-events-none absolute -top-[10%] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(198,137,88,0.16),_transparent_70%)]"
			aria-hidden="true"
		></div>

		<div class="relative mx-auto max-w-2xl px-4 pt-20 pb-14 text-center sm:pt-28 sm:pb-16">
			<span
				class="inline-flex items-center gap-2 rounded-full border border-[#172420]/10 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#96392C] uppercase backdrop-blur-sm"
			>
				Min profil
			</span>

			<h1
				class="mt-8 font-['Instrument_Serif'] text-[2.75rem] leading-[1.05] text-[#172420] italic sm:text-6xl"
			>
				Hej{#if $userStore}, {$userStore.email}{/if}
			</h1>

			<p class="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#46605A] sm:text-lg">
				Her kan du se dine bookede tider og administrere din konto.
			</p>
		</div>
	</section>

	<section class="px-4 pt-6 pb-20 sm:pt-8 sm:pb-24">
		<div class="mx-auto max-w-3xl">
			<div class="max-w-md">
				<span class="text-[11px] font-semibold tracking-[0.24em] text-[#96392C] uppercase">
					Dine bookinger
				</span>
				<h2 class="mt-3 font-['Instrument_Serif'] text-3xl text-[#172420] italic sm:text-4xl">
					Kommende tider
				</h2>
			</div>

			<div class="mt-6 max-w-xs text-[#172420]/15">
				<MovementLine />
			</div>

			{#if loading}
				<div class="mt-8 flex items-center gap-2 text-sm text-[#46605A]">
					<Spinner class="h-4 w-4 text-[#96392C]" />
					Henter bookinger…
				</div>
			{:else if upcomingBookings.length === 0}
				<div class="mt-10">
					<Card>
						<div class="flex flex-col items-center gap-4 py-6 text-center">
							<p class="text-sm text-[#46605A]">Du har ingen kommende bookinger endnu.</p>
							<Button href="/book" size="sm">Book en tid</Button>
						</div>
					</Card>
				</div>
			{:else}
				<ol class="mt-10 space-y-4">
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
										onclick={() => handleCancel(slot)}
										disabled={pendingId === slot.id}
										class="shrink-0 rounded-full border border-[#96392C]/25 px-5 py-2.5 text-sm font-semibold text-[#96392C] transition hover:bg-[#96392C]/5 disabled:cursor-not-allowed disabled:opacity-50"
									>
										{#if pendingId === slot.id}
											<Spinner class="mr-1 inline h-3.5 w-3.5" />
										{/if}
										{pendingId === slot.id ? 'Aflyser…' : 'Aflys'}
									</button>
								</div>
							</Card>
						</li>
					{/each}
				</ol>
			{/if}
		</div>
	</section>

	<section class="px-4 pb-24 sm:pb-32">
		<div class="mx-auto max-w-3xl">
			<div class="max-w-md">
				<span class="text-[11px] font-semibold tracking-[0.24em] text-[#96392C] uppercase">
					Konto
				</span>
				<h2 class="mt-3 font-['Instrument_Serif'] text-3xl text-[#172420] italic sm:text-4xl">
					Kontoindstillinger
				</h2>
			</div>

			<div class="mt-6 max-w-xs text-[#172420]/15">
				<MovementLine />
			</div>

			<div class="mt-10 space-y-4">
				<Card>
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div class="min-w-0 flex-1">
							<p class="text-[11px] font-semibold tracking-[0.14em] text-[#46605A]/70 uppercase">
								Email
							</p>

							{#if isEditingEmail}
								<input
									type="email"
									bind:value={editedEmail}
									class="mt-2 w-full max-w-sm rounded-xl border border-[#172420]/12 bg-white px-4 py-2.5 text-sm text-[#172420] outline-none focus:border-[#96392C]/40"
								/>
							{:else}
								<p class="mt-1 font-['Instrument_Serif'] text-xl text-[#172420] italic">
									{$userStore?.email}
								</p>
							{/if}
						</div>

						{#if isEditingEmail}
							<div class="flex shrink-0 gap-2">
								<button
									onclick={handleSaveEmail}
									disabled={isSavingEmail}
									class="rounded-full bg-[#172420] px-5 py-2.5 text-sm font-semibold text-[#ECF0E9] transition hover:bg-[#46605A] disabled:opacity-50"
								>
									{isSavingEmail ? 'Gemmer…' : 'Gem'}
								</button>
								<button
									onclick={() => (isEditingEmail = false)}
									disabled={isSavingEmail}
									class="rounded-full border border-[#172420]/12 px-5 py-2.5 text-sm text-[#46605A] transition hover:bg-[#172420]/5"
								>
									Annullér
								</button>
							</div>
						{:else}
							<button
								onclick={() => (isEditingEmail = true)}
								class="shrink-0 rounded-full border border-[#172420]/12 px-5 py-2.5 text-sm font-semibold text-[#172420] transition hover:bg-[#172420]/5"
							>
								Redigér
							</button>
						{/if}
					</div>
				</Card>

				<Card>
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p class="text-[11px] font-semibold tracking-[0.14em] text-[#96392C]/70 uppercase">
								Fare-zone
							</p>
							<p class="mt-1 text-sm text-[#46605A]">
								Sletter du kontoen, mister du adgang til dine bookinger permanent.
							</p>
						</div>

						{#if showDeleteConfirm}
							<div class="flex shrink-0 gap-2">
								<button
									onclick={handleDeleteUser}
									disabled={isDeleting}
									class="rounded-full bg-[#96392C] px-5 py-2.5 text-sm font-semibold text-[#ECF0E9] transition hover:bg-[#96392C]/85 disabled:opacity-50"
								>
									{isDeleting ? 'Sletter…' : 'Ja, slet konto'}
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
								Slet konto
							</button>
						{/if}
					</div>
				</Card>
			</div>
		</div>
	</section>
</div>
