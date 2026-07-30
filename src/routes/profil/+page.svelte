<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/auth';
	import { triggerToast } from '$lib/stores/toastStore';
	import { logout } from '$lib/utils/auth';
	import { getMyBookings, cancelBooking, type TimeSlot } from '$lib/api/booking';
	import { updateUser, deleteUser } from '$lib/api/user';
	import { setCookie } from '$lib/utils/cookies';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let bookings = $state<TimeSlot[]>([]);
	let loading = $state(true);
	let pendingId = $state<number | null>(null);

	function autofocusAction(node: HTMLElement) {
		node.focus();
	}

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
		$userStore;
		loadBookings();
	});


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
		setCookie('jwt', result.token, {
			'max-age': 60 * 60 * 24 * 30,
			path: '/',
			samesite: 'lax',
			secure: true
		});
		userStore.update((u) => (u ? { ...u, email: editedEmail.trim(), jwt: result.token } : u));
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

<div class="min-h-screen bg-[#ECF0E9]">

	<section class="relative overflow-hidden border-b border-[#172420]/6">
		<div
			class="pointer-events-none absolute inset-0"
			aria-hidden="true"
			style="background: radial-gradient(ellipse 60% 50% at 50% -10%, rgba(198,137,88,0.13), transparent)"
		></div>

		<div class="relative mx-auto max-w-3xl px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
			<div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center">

				<div
					class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#172420] text-2xl font-semibold text-[#ECF0E9] shadow-[0_12px_32px_-12px_rgba(23,36,32,0.45)] sm:h-24 sm:w-24 sm:text-3xl"
				>
					{#if $userStore?.email}
						{$userStore.email[0].toUpperCase()}
					{:else}
						?
					{/if}
				</div>

				<div class="min-w-0">
					<span
						class="inline-flex items-center gap-1.5 rounded-full border border-[#172420]/10 bg-white/80 px-3 py-1 font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.18em] text-[#46605A] uppercase backdrop-blur-sm"
					>
						<span class="h-1.5 w-1.5 rounded-full bg-[#46a074]"></span>
						Logget ind
					</span>

					<h1
						class="mt-3 font-['Instrument_Serif'] text-3xl leading-tight text-[#172420] italic sm:text-4xl"
					>
						{#if $userStore}
							{$userStore.email}
						{:else}
							Min profil
						{/if}
					</h1>

					{#if $userStore?.roles?.length}
						<div class="mt-2 flex flex-wrap gap-1.5">
							{#each $userStore.roles as role}
								<span
									class="rounded-full border border-[#172420]/10 bg-white/70 px-2.5 py-0.5 font-['IBM_Plex_Mono'] text-[10px] font-medium tracking-[0.1em] text-[#46605A] uppercase"
								>
									{role}
								</span>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			{#if !loading}
				<div class="mt-10 flex flex-wrap gap-3">
					<div class="flex items-center gap-3 rounded-2xl border border-[#172420]/8 bg-white/70 px-5 py-3.5 backdrop-blur-sm">
						<div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#172420]/6 text-[#172420]">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-4 w-4">
								<rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" stroke-width="1.6"/>
								<path d="M3.5 9.5H20.5" stroke="currentColor" stroke-width="1.6"/>
								<path d="M7.5 3V6.5M16.5 3V6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
							</svg>
						</div>
						<div>
							<p class="font-['IBM_Plex_Mono'] text-[10px] font-medium tracking-[0.12em] text-[#46605A]/70 uppercase">Bookinger</p>
							<p class="mt-0.5 text-lg font-semibold leading-none text-[#172420]">{upcomingBookings.length}</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<section class="px-4 py-12 sm:py-16">
		<div class="mx-auto max-w-3xl">

			<div class="mb-8 flex items-center justify-between gap-4">
				<div>
					<p class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.2em] text-[#96392C] uppercase">
						Dine bookinger
					</p>
					<h2 class="mt-1.5 font-['Instrument_Serif'] text-2xl text-[#172420] italic sm:text-3xl">
						Kommende tider
					</h2>
				</div>
				<Button href="/book" size="sm" variant="ghost">Book ny tid</Button>
			</div>

			{#if loading}
				<div class="space-y-3">
					{#each [1, 2, 3] as _}
						<div class="h-24 animate-pulse rounded-[28px] bg-[#172420]/5"></div>
					{/each}
				</div>
			{:else if upcomingBookings.length === 0}
				<div
					class="flex flex-col items-center gap-5 rounded-[28px] border border-dashed border-[#172420]/15 bg-white/50 py-14 text-center"
				>
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-[#172420]/6 text-[#172420]/40">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-6 w-6">
							<rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" stroke-width="1.6"/>
							<path d="M3.5 9.5H20.5" stroke="currentColor" stroke-width="1.6"/>
							<path d="M7.5 3V6.5M16.5 3V6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
							<circle cx="8" cy="14.5" r="1.1" fill="currentColor"/>
							<circle cx="12" cy="14.5" r="1.1" fill="currentColor"/>
						</svg>
					</div>
					<div>
						<p class="font-medium text-[#172420]">Ingen kommende bookinger</p>
						<p class="mt-1 text-sm text-[#46605A]">Du har ikke booket nogen tider endnu.</p>
					</div>
					<Button href="/book" size="sm">Find en ledig tid</Button>
				</div>
			{:else}
				<ol class="space-y-3">
					{#each upcomingBookings as slot (slot.id)}
						<li
							class="group flex items-center gap-4 rounded-[28px] border border-[#172420]/8 bg-white p-5 shadow-[0_8px_30px_-15px_rgba(23,36,32,0.2)] transition hover:border-[#172420]/15 hover:shadow-[0_12px_40px_-15px_rgba(23,36,32,0.28)] sm:p-6"
						>
							<div class="hidden shrink-0 flex-col items-center rounded-2xl bg-[#172420]/5 px-4 py-3 text-center sm:flex">
								<span class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.1em] text-[#46605A] uppercase">
									{new Date(slot.startTimeUtc + (slot.startTimeUtc.endsWith('Z') ? '' : 'Z')).toLocaleDateString('da-DK', { month: 'short' })}
								</span>
								<span class="mt-0.5 font-['Instrument_Serif'] text-2xl leading-none text-[#172420] italic">
									{new Date(slot.startTimeUtc + (slot.startTimeUtc.endsWith('Z') ? '' : 'Z')).getDate()}
								</span>
							</div>

							<div class="min-w-0 flex-1">
								<p class="font-medium text-[#172420] capitalize sm:hidden">
									{formatDate(slot.startTimeUtc)}
								</p>
								<p class="hidden font-medium text-[#172420] sm:block">
									{new Date(slot.startTimeUtc + (slot.startTimeUtc.endsWith('Z') ? '' : 'Z')).toLocaleDateString('da-DK', { weekday: 'long' })}
								</p>
								<p class="mt-0.5 font-['IBM_Plex_Mono'] text-sm text-[#46605A]">
									{formatTimeRange(slot.startTimeUtc, slot.endTimeUtc)}
								</p>
								{#if slot.notes}
									<p class="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#172420]/8 bg-[#172420]/4 px-2.5 py-0.5 text-xs text-[#46605A]">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-3 w-3"><path d="M7 8h10M7 12h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.6"/></svg>
										{slot.notes}
									</p>
								{/if}
							</div>

							<button
								onclick={() => handleCancel(slot)}
								disabled={pendingId === slot.id}
								class="shrink-0 rounded-full border border-[#96392C]/20 px-4 py-2 text-xs font-semibold text-[#96392C] transition hover:border-[#96392C]/40 hover:bg-[#96392C]/6 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
							>
								{#if pendingId === slot.id}
									<Spinner class="mr-1 inline h-3.5 w-3.5" />
									Aflyser…
								{:else}
									Aflys
								{/if}
							</button>
						</li>
					{/each}
				</ol>
			{/if}
		</div>
	</section>

	<section class="px-4 pb-16 sm:pb-20">
		<div class="mx-auto max-w-3xl">

			<div class="mb-8">
				<p class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.2em] text-[#96392C] uppercase">
					Konto
				</p>
				<h2 class="mt-1.5 font-['Instrument_Serif'] text-2xl text-[#172420] italic sm:text-3xl">
					Kontoindstillinger
				</h2>
			</div>

			<div class="overflow-hidden rounded-[28px] border border-[#172420]/8 bg-white shadow-[0_8px_30px_-15px_rgba(23,36,32,0.2)]">

				<div class="border-b border-[#172420]/6 p-6">
					<div class="flex items-start gap-4">
						<div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#172420]/6 text-[#172420]">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-4 w-4">
								<rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" stroke-width="1.6"/>
								<path d="M3 9l9 5.5L21 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
							</svg>
						</div>
						<div class="min-w-0 flex-1">
							<p class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.14em] text-[#46605A]/70 uppercase">
								Email-adresse
							</p>
							{#if isEditingEmail}
								<div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
									<input
										type="email"
										bind:value={editedEmail}
										use:autofocusAction
										class="w-full rounded-xl border border-[#172420]/15 bg-[#ECF0E9]/60 px-4 py-2.5 text-sm text-[#172420] outline-none transition focus:border-[#96392C]/50 focus:ring-2 focus:ring-[#96392C]/15 sm:max-w-xs"
									/>
									<div class="flex gap-2">
										<button
											onclick={handleSaveEmail}
											disabled={isSavingEmail}
											class="inline-flex items-center gap-1.5 rounded-full bg-[#172420] px-5 py-2 text-sm font-semibold text-[#ECF0E9] transition hover:bg-[#46605A] disabled:opacity-50"
										>
											{#if isSavingEmail}
												<Spinner class="h-3.5 w-3.5" />
											{/if}
											{isSavingEmail ? 'Gemmer…' : 'Gem ændringer'}
										</button>
										<button
											onclick={() => (isEditingEmail = false)}
											disabled={isSavingEmail}
											class="rounded-full border border-[#172420]/12 px-4 py-2 text-sm text-[#46605A] transition hover:bg-[#172420]/5"
										>
											Annullér
										</button>
									</div>
								</div>
							{:else}
								<div class="mt-1.5 flex items-center justify-between gap-4">
									<p class="truncate font-['Instrument_Serif'] text-lg text-[#172420] italic">
										{$userStore?.email}
									</p>
									<button
										onclick={() => (isEditingEmail = true)}
										class="shrink-0 rounded-full border border-[#172420]/12 px-4 py-1.5 font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.08em] text-[#172420] transition hover:bg-[#172420]/5"
									>
										Redigér
									</button>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<div class="px-6 py-5">
					<div class="flex items-center gap-4">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#172420]/6 text-[#172420]">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-4 w-4">
								<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/>
								<path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
						<div>
							<p class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.14em] text-[#46605A]/70 uppercase">Brugertype</p>
							<p class="mt-0.5 text-sm text-[#172420]">
								{$userStore?.roles?.includes('Admin') ? 'Administrator' : 'Bruger'}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-5 overflow-hidden rounded-[28px] border border-[#96392C]/15 bg-[#96392C]/3 shadow-[0_8px_30px_-15px_rgba(150,57,44,0.15)]">
				<div class="border-b border-[#96392C]/10 px-6 py-4">
					<div class="flex items-center gap-2.5">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-4 w-4 text-[#96392C]">
							<path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
							<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
						</svg>
						<p class="font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.14em] text-[#96392C] uppercase">
							Fare-zone
						</p>
					</div>
				</div>

				<div class="p-6">
					<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div class="max-w-sm">
							<p class="font-medium text-[#172420]">Slet konto permanent</p>
							<p class="mt-1 text-sm leading-relaxed text-[#46605A]">
								Alle dine bookinger frigives, og kontoen kan ikke gendannes. Vær sikker før du fortsætter.
							</p>
						</div>

						{#if showDeleteConfirm}
							<div class="flex shrink-0 flex-col gap-2 sm:items-end">
								<p class="text-xs text-[#46605A]">Er du helt sikker?</p>
								<div class="flex gap-2">
									<button
										onclick={handleDeleteUser}
										disabled={isDeleting}
										class="inline-flex items-center gap-1.5 rounded-full bg-[#96392C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7e2f24] disabled:opacity-50"
									>
										{#if isDeleting}<Spinner class="h-3.5 w-3.5" />{/if}
										{isDeleting ? 'Sletter…' : 'Ja, slet min konto'}
									</button>
									<button
										onclick={() => (showDeleteConfirm = false)}
										disabled={isDeleting}
										class="rounded-full border border-[#172420]/12 px-4 py-2.5 text-sm text-[#46605A] transition hover:bg-[#172420]/5"
									>
										Annullér
									</button>
								</div>
							</div>
						{:else}
							<button
								onclick={() => (showDeleteConfirm = true)}
								class="shrink-0 rounded-full border border-[#96392C]/30 px-5 py-2.5 text-sm font-semibold text-[#96392C] transition hover:border-[#96392C]/50 hover:bg-[#96392C]/8"
							>
								Slet konto
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
