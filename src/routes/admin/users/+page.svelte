<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllUsers, type User } from '$lib/api/user';
	import { triggerToast } from '$lib/stores/toastStore';
	import Card from '$lib/components/ui/Card.svelte';
	import MovementLine from '$lib/components/ui/MovementLine.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let users = $state<User[]>([]);
	let loading = $state(true);
	let search = $state('');

	async function loadUsers() {
		loading = true;
		try {
			users = await getAllUsers();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke hente brugere.', 'error');
		} finally {
			loading = false;
		}
	}

	const filteredUsers = $derived(
		search.trim()
			? users.filter((u) => u.email.toLowerCase().includes(search.trim().toLowerCase()))
			: users
	);

	onMount(loadUsers);
</script>

<svelte:head>
	<title>Brugere · Admin</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 pt-16 pb-10 sm:pt-24 sm:pb-14">
	<span
		class="inline-flex items-center gap-2 rounded-full border border-[#172420]/10 bg-white px-4 py-1.5 font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.16em] text-[#46605A] uppercase"
	>
		Admin · Brugere
	</span>

	<h1 class="mt-7 font-['Instrument_Serif'] text-4xl leading-[1.1] text-[#172420] italic sm:text-5xl">
		Brugere
	</h1>

	<p class="mt-6 max-w-xl text-base leading-relaxed text-[#46605A] sm:text-lg">
		Klik på en bruger for at se og administrere deres bookede tider.
	</p>
</div>

<section class="bg-[#ECF0E9] px-4 pt-2 pb-20">
	<div class="mx-auto max-w-3xl">
		<div class="flex items-center justify-between gap-4">
			<div class="max-w-xs text-[#172420]/15">
				<MovementLine />
			</div>
			<span class="font-['IBM_Plex_Mono'] text-xs text-[#46605A]">
				{filteredUsers.length}
				{filteredUsers.length === 1 ? 'bruger' : 'brugere'}
			</span>
		</div>

		<input
			type="text"
			bind:value={search}
			placeholder="Søg på email…"
			class="mt-6 w-full max-w-sm rounded-xl border border-[#172420]/12 bg-white px-4 py-2.5 text-sm text-[#172420] outline-none focus:border-[#96392C]/40"
		/>

		{#if loading}
			<div class="mt-8 flex items-center gap-2 text-sm text-[#46605A]">
				<Spinner class="h-4 w-4 text-[#96392C]" />
				Henter brugere…
			</div>
		{:else if filteredUsers.length === 0}
			<div class="mt-10">
				<Card>
					<p class="py-6 text-center text-sm text-[#46605A]">
						{search ? 'Ingen brugere matcher din søgning.' : 'Der er ingen brugere endnu.'}
					</p>
				</Card>
			</div>
		{:else}
			<ol class="mt-8 space-y-3">
				{#each filteredUsers as user (user.id)}
					<li>
						<a
							href={`/admin/users/${user.id}`}
							class="group block rounded-[24px] border border-[#172420]/10 bg-white p-5 shadow-[0_15px_40px_-25px_rgba(23,36,32,0.35)] transition hover:border-[#96392C]/30"
						>
							<div class="flex items-center justify-between gap-4">
								<div class="min-w-0">
									<p
										class="truncate font-['Instrument_Serif'] text-lg text-[#172420] italic group-hover:text-[#96392C]"
									>
										{user.email}
									</p>
									<p class="mt-1 font-['IBM_Plex_Mono'] text-[11px] tracking-[0.08em] text-[#46605A] uppercase">
										{user.role}
									</p>
								</div>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									class="h-4 w-4 shrink-0 text-[#96392C] transition-transform group-hover:translate-x-1"
								>
									<path
										d="M5 12H19M19 12L13 6M19 12L13 18"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
						</a>
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</section>