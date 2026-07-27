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
	import DateTimePicker from '$lib/components/DateTimePicker.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let slots = $state<TimeSlot[]>([]);
	let loading = $state(true);
	let deletingId = $state<number | null>(null);

	let singleStart = $state('');
	let singleEnd = $state('');
	let singleNotes = $state('');
	let creatingSingle = $state(false);
	let singleFormKey = $state(0);

	let bulkFrom = $state('');
	let bulkTo = $state('');
	let bulkLength = $state(30);
	let creatingBulk = $state(false);
	let bulkFormKey = $state(0);

	async function loadSlots() {
		loading = true;
		try {
			slots = (await getAllTimeSlots()).sort(
				(a, b) => parseAsUtc(a.startTimeUtc).getTime() - parseAsUtc(b.startTimeUtc).getTime()
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

	function parseAsUtc(iso: string): Date {
		const hasTimezoneInfo = /Z$|[+-]\d{2}:?\d{2}$/.test(iso);
		return new Date(hasTimezoneInfo ? iso : `${iso}Z`);
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
			singleFormKey++;
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
			const result = await createBulkTimeSlots({
				fromUtc: toUtcIso(bulkFrom),
				toUtc: toUtcIso(bulkTo),
				slotLengthMinutes: bulkLength
			});
			triggerToast(result.message, 'success');
			bulkFrom = '';
			bulkTo = '';
			bulkFormKey++;
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
			const result = await deleteTimeSlot(slot.id);
			triggerToast(result.message, 'success');
			await loadSlots();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke slette tiden.', 'error');
		} finally {
			deletingId = null;
		}
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

	function formatEndTime(iso: string): string {
		return parseAsUtc(iso).toLocaleTimeString('da-DK', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const inputClass =
		"mt-1 w-full rounded-xl border border-[#172420]/15 bg-white px-3 py-2 font-['Public_Sans'] text-sm text-[#172420] transition focus:border-[#96392C] focus:outline-none focus:ring-2 focus:ring-[#96392C]/20";

	const labelClass =
		"mb-2 block font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.14em] text-[#46605A] uppercase";

	onMount(loadSlots);
</script>

<div class="mx-auto max-w-4xl px-4 pt-16 pb-10 sm:pt-24 sm:pb-14">
	<span
		class="inline-flex items-center gap-2 rounded-full border border-[#172420]/10 bg-white px-4 py-1.5 font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.16em] text-[#46605A] uppercase"
	>
		Admin
	</span>

	<h1 class="mt-7 font-['Instrument_Serif'] text-4xl leading-[1.1] text-[#172420] italic sm:text-5xl">
		Administrer tider
	</h1>

	<p class="mt-6 max-w-xl text-base leading-relaxed text-[#46605A] sm:text-lg">
		Opret ledige tider som kunder kan booke — enkeltvis eller for en hel periode ad gangen.
	</p>
</div>

<section class="bg-[#ECF0E9] px-4 pt-2 pb-20">
	<div class="mx-auto max-w-4xl">
		<div class="grid gap-5 md:grid-cols-2">
			<form
				onsubmit={handleCreateSingle}
				class="rounded-[24px] border border-[#172420]/10 bg-white p-6 shadow-[0_15px_40px_-25px_rgba(23,36,32,0.35)]"
			>
				<h2 class="font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#46605A] uppercase">
					Opret én tid
				</h2>

				{#key singleFormKey}
					<div class="mt-5 space-y-4">
						<label class="block text-sm">
							<span class={labelClass}>Start</span>
							<DateTimePicker bind:value={singleStart} required />
						</label>
						<label class="block text-sm">
							<span class={labelClass}>Slut</span>
							<DateTimePicker bind:value={singleEnd} required />
						</label>
						<label class="block text-sm">
							<span class={labelClass}>Note (valgfri)</span>
							<input
								type="text"
								bind:value={singleNotes}
								class={inputClass}
								placeholder="F.eks. individuel session"
							/>
						</label>
					</div>
				{/key}

				<Button type="submit" size="lg" disabled={creatingSingle} class="mt-6 w-full">
					{#if creatingSingle}
						<Spinner class="h-4 w-4" />
						Opretter…
					{:else}
						Opret tid
					{/if}
				</Button>
			</form>

			<form
				onsubmit={handleCreateBulk}
				class="rounded-[24px] border border-[#172420]/10 bg-white p-6 shadow-[0_15px_40px_-25px_rgba(23,36,32,0.35)]"
			>
				<h2 class="font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#46605A] uppercase">
					Opret flere tider
				</h2>

				{#key bulkFormKey}
					<div class="mt-5 space-y-4">
						<label class="block text-sm">
							<span class={labelClass}>Fra</span>
							<DateTimePicker bind:value={bulkFrom} required />
						</label>
						<label class="block text-sm">
							<span class={labelClass}>Til</span>
							<DateTimePicker bind:value={bulkTo} required />
						</label>
						<label class="block text-sm">
							<span class={labelClass}>Varighed pr. tid (minutter)</span>
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
				{/key}

				<Button type="submit" size="lg" disabled={creatingBulk} class="mt-6 w-full">
					{#if creatingBulk}
						<Spinner class="h-4 w-4" />
						Opretter…
					{:else}
						Opret tider
					{/if}
				</Button>
			</form>
		</div>

		<div class="mt-10">
			<h2 class="font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#46605A] uppercase">
				Alle tider
			</h2>

			{#if loading}
				<div class="mt-4 flex items-center gap-2 text-sm text-[#46605A]">
					<Spinner class="h-4 w-4 text-[#96392C]" />
					Henter tider…
				</div>
			{:else if slots.length === 0}
				<p class="mt-4 text-sm text-[#46605A]">Ingen tider oprettet endnu.</p>
			{:else}
				<ul
					class="mt-3 divide-y divide-[#172420]/6 rounded-[24px] border border-[#172420]/10 bg-white shadow-[0_15px_40px_-25px_rgba(23,36,32,0.35)]"
				>
					{#each slots as slot (slot.id)}
						<li class="flex items-center justify-between gap-3 px-5 py-3.5">
							<div class="min-w-0">
								<span class="text-sm text-[#172420] capitalize"
									>{formatTime(slot.startTimeUtc)} – {formatEndTime(slot.endTimeUtc)}</span
								>
								{#if slot.notes}
									<span class="ml-2 truncate font-['IBM_Plex_Mono'] text-xs text-[#46605A]/60">{slot.notes}</span>
								{/if}
							</div>
							<div class="flex shrink-0 items-center gap-3">
								{#if slot.isBooked && slot.bookedByUserEmail}
									<span class="hidden font-['IBM_Plex_Mono'] text-[10px] text-[#46605A] sm:inline"
										>{slot.bookedByUserEmail}</span
									>
								{/if}
								<span
									class="rounded-full px-2.5 py-0.5 font-['IBM_Plex_Mono'] text-[10px] font-medium tracking-[0.06em] uppercase {slot.isBooked
										? 'bg-[#96392C]/10 text-[#96392C]'
										: 'bg-[#46605A]/10 text-[#46605A]'}"
								>
									{slot.isBooked ? 'Booket' : 'Ledig'}
								</span>
								<button
									class="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-[#46605A]/70 uppercase transition hover:text-[#96392C] disabled:opacity-50"
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
		</div>
	</div>
</section>