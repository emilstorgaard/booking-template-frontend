<script lang="ts">
	import { onMount } from 'svelte';
	import { triggerToast } from '$lib/stores/toastStore';
	import {
		getAllTimeSlots,
		createTimeSlot,
		createBulkTimeSlots,
		deleteTimeSlot,
		type TimeSlot
	} from '$lib/api/booking';
	import Spinner from '$lib/components/Spinner.svelte';

	let slots = $state<TimeSlot[]>([]);
	let loading = $state(true);
	let deletingId = $state<number | null>(null);

	let singleStart = $state('');
	let singleEnd = $state('');
	let singleNotes = $state('');
	let creatingSingle = $state(false);

	let bulkFrom = $state('');
	let bulkTo = $state('');
	let bulkLength = $state(30);
	let creatingBulk = $state(false);

	async function loadSlots() {
		loading = true;
		try {
			slots = (await getAllTimeSlots()).sort(
				(a, b) => new Date(a.startTimeUtc).getTime() - new Date(b.startTimeUtc).getTime()
			);
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke hente tider.', 'error');
		} finally {
			loading = false;
		}
	}

	function toUtcIso(localDateTime: string): string {
		return new Date(localDateTime).toISOString();
	}

	async function handleCreateSingle(e: SubmitEvent) {
		e.preventDefault();
		if (!singleStart || !singleEnd) return;

		creatingSingle = true;
		try {
			const result = await createTimeSlot({
				startTimeUtc: toUtcIso(singleStart),
				endTimeUtc: toUtcIso(singleEnd),
				notes: singleNotes || null
			});
			triggerToast(result.message, 'success');
			singleStart = '';
			singleEnd = '';
			singleNotes = '';
			await loadSlots();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke oprette tiden.', 'error');
		} finally {
			creatingSingle = false;
		}
	}

	async function handleCreateBulk(e: SubmitEvent) {
		e.preventDefault();
		if (!bulkFrom || !bulkTo || bulkLength <= 0) return;

		creatingBulk = true;
		try {
			const created = await createBulkTimeSlots({
				fromUtc: toUtcIso(bulkFrom),
				toUtc: toUtcIso(bulkTo),
				slotLengthMinutes: bulkLength
			});
			triggerToast(`${created.length} tider oprettet.`, 'success');
			bulkFrom = '';
			bulkTo = '';
			await loadSlots();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke oprette tiderne.', 'error');
		} finally {
			creatingBulk = false;
		}
	}

	async function handleDelete(slot: TimeSlot) {
		deletingId = slot.id;
		try {
			await deleteTimeSlot(slot.id);
			triggerToast('Tiden er slettet.', 'success');
			await loadSlots();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke slette tiden.', 'error');
		} finally {
			deletingId = null;
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

	function formatEndTime(iso: string): string {
		return new Date(iso).toLocaleTimeString('da-DK', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const inputClass =
		'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

	onMount(loadSlots);
</script>

<div class="mx-auto max-w-4xl px-4 py-12 sm:py-16">
	<h1 class="text-3xl font-semibold text-slate-900 sm:text-4xl">Administrer tider</h1>
	<p class="mt-2 text-slate-500">Opret ledige tider som brugere kan booke.</p>

	<div class="mt-8 grid gap-5 md:grid-cols-2">
		<!-- OPRET ÉN TID -->
		<form
			onsubmit={handleCreateSingle}
			class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
		>
			<h2 class="text-xs font-semibold tracking-wide text-slate-400 uppercase">Opret én tid</h2>
			<div class="mt-4 space-y-3">
				<label class="block text-sm">
					<span class="text-slate-600">Start</span>
					<input type="datetime-local" bind:value={singleStart} required class={inputClass} />
				</label>
				<label class="block text-sm">
					<span class="text-slate-600">Slut</span>
					<input type="datetime-local" bind:value={singleEnd} required class={inputClass} />
				</label>
				<label class="block text-sm">
					<span class="text-slate-600">Note (valgfri)</span>
					<input type="text" bind:value={singleNotes} class={inputClass} />
				</label>
			</div>
			<button
				type="submit"
				disabled={creatingSingle}
				class="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{#if creatingSingle}
					<Spinner class="h-4 w-4" />
					Opretter…
				{:else}
					Opret tid
				{/if}
			</button>
		</form>

		<form
			onsubmit={handleCreateBulk}
			class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
		>
			<h2 class="text-xs font-semibold tracking-wide text-slate-400 uppercase">
				Opret flere tider
			</h2>
			<div class="mt-4 space-y-3">
				<label class="block text-sm">
					<span class="text-slate-600">Fra</span>
					<input type="datetime-local" bind:value={bulkFrom} required class={inputClass} />
				</label>
				<label class="block text-sm">
					<span class="text-slate-600">Til</span>
					<input type="datetime-local" bind:value={bulkTo} required class={inputClass} />
				</label>
				<label class="block text-sm">
					<span class="text-slate-600">Varighed pr. tid (minutter)</span>
					<input
						type="number"
						min="5"
						step="5"
						bind:value={bulkLength}
						required
						class={inputClass}
					/>
				</label>
			</div>
			<button
				type="submit"
				disabled={creatingBulk}
				class="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{#if creatingBulk}
					<Spinner class="h-4 w-4" />
					Opretter…
				{:else}
					Opret tider
				{/if}
			</button>
		</form>
	</div>

	<section class="mt-10">
		<h2 class="text-xs font-semibold tracking-wide text-slate-400 uppercase">Alle tider</h2>

		{#if loading}
			<div class="mt-4 flex items-center gap-2 text-sm text-slate-500">
				<Spinner class="h-4 w-4 text-brand-500" />
				Henter tider…
			</div>
		{:else if slots.length === 0}
			<p class="mt-4 text-sm text-slate-500">Ingen tider oprettet endnu.</p>
		{:else}
			<ul
				class="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm"
			>
				{#each slots as slot (slot.id)}
					<li class="flex items-center justify-between gap-3 px-5 py-3.5">
						<div class="min-w-0">
							<span class="text-sm text-slate-800"
								>{formatTime(slot.startTimeUtc)} – {formatEndTime(slot.endTimeUtc)}</span
							>
							{#if slot.notes}
								<span class="ml-2 truncate text-xs text-slate-400">{slot.notes}</span>
							{/if}
						</div>
						<div class="flex shrink-0 items-center gap-3">
							{#if slot.isBooked && slot.bookedByUserEmail}
								<span class="hidden text-xs text-slate-500 sm:inline">{slot.bookedByUserEmail}</span
								>
							{/if}
							<span
								class="rounded-full px-2.5 py-0.5 text-xs font-medium {slot.isBooked
									? 'bg-brand-50 text-brand-700'
									: 'bg-tide/10 text-tide'}"
							>
								{slot.isBooked ? 'Booket' : 'Ledig'}
							</span>
							<button
								class="text-sm text-slate-400 transition hover:text-red-600 disabled:opacity-50"
								disabled={slot.isBooked || deletingId === slot.id}
								title={slot.isBooked ? 'Kan ikke slette en booket tid' : 'Slet tid'}
								onclick={() => handleDelete(slot)}
							>
								{deletingId === slot.id ? 'Sletter…' : 'Slet'}
							</button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
