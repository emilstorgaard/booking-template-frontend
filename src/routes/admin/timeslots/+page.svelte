<script lang="ts">
	import { onMount } from 'svelte';
	import { triggerToast } from '$lib/stores/toastStore';
	import {
		getAllTimeSlots,
		createTimeSlot,
		createBulkTimeSlots,
		updateTimeSlot,
		deleteTimeSlot,
		adminCancelBooking,
		type TimeSlot
	} from '$lib/api/booking';
	import Spinner from '$lib/components/Spinner.svelte';
	import DateTimePicker from '$lib/components/DateTimePicker.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let slots = $state<TimeSlot[]>([]);
	let loading = $state(true);
	let deletingId = $state<number | null>(null);
	let confirmDeleteId = $state<number | null>(null);
	let cancellingId = $state<number | null>(null);

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

	let editingId = $state<number | null>(null);
	let editStart = $state('');
	let editEnd = $state('');
	let editNotes = $state('');
	let savingEdit = $state(false);

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

	function toLocalInputValue(iso: string): string {
		const d = parseAsUtc(iso);
		const offsetMs = d.getTimezoneOffset() * 60000;
		return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
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

	function startEdit(slot: TimeSlot) {
		editingId = slot.id;
		editStart = toLocalInputValue(slot.startTimeUtc);
		editEnd = toLocalInputValue(slot.endTimeUtc);
		editNotes = slot.notes ?? '';
	}

	function cancelEdit() {
		editingId = null;
	}

	async function handleSaveEdit(slot: TimeSlot) {
		if (!editStart || !editEnd) return;

		savingEdit = true;
		try {
			const result = await updateTimeSlot(slot.id, {
				startTimeUtc: toUtcIso(editStart),
				endTimeUtc: toUtcIso(editEnd),
				notes: editNotes || null
			});
			triggerToast(result.message, 'success');
			editingId = null;
			await loadSlots();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke opdatere tiden.', 'error');
		} finally {
			savingEdit = false;
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
			confirmDeleteId = null;
		}
	}

	async function handleCancelBooking(slot: TimeSlot) {
		cancellingId = slot.id;
		try {
			await adminCancelBooking(slot.id);
			triggerToast('Bookingen er aflyst.', 'success');
			await loadSlots();
		} catch (err) {
			triggerToast(err instanceof Error ? err.message : 'Kunne ikke aflyse booking.', 'error');
		} finally {
			cancellingId = null;
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

	const bookedSlots = $derived(slots.filter((s) => s.isBooked));
	const availableSlots = $derived(slots.filter((s) => !s.isBooked));

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

	<h1
		class="mt-7 font-['Instrument_Serif'] text-4xl leading-[1.1] text-[#172420] italic sm:text-5xl"
	>
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
				<h2
					class="font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#46605A] uppercase"
				>
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
				<h2
					class="font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#46605A] uppercase"
				>
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

		{#if loading}
			<div class="mt-10 flex items-center gap-2 text-sm text-[#46605A]">
				<Spinner class="h-4 w-4 text-[#96392C]" />
				Henter tider…
			</div>
		{:else}
			<div class="mt-10">
				<div class="flex items-center justify-between">
					<h2
						class="font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#96392C] uppercase"
					>
						Booket
					</h2>
					<span class="font-['IBM_Plex_Mono'] text-[10px] text-[#46605A]">{bookedSlots.length}</span
					>
				</div>

				{#if bookedSlots.length === 0}
					<p class="mt-3 text-sm text-[#46605A]">Ingen bookede tider.</p>
				{:else}
					<ul
						class="mt-3 divide-y divide-[#172420]/6 rounded-[24px] border border-[#172420]/10 bg-white shadow-[0_15px_40px_-25px_rgba(23,36,32,0.35)]"
					>
						{#each bookedSlots as slot (slot.id)}
							<li class="px-5 py-3.5">
								{#if editingId === slot.id}
									<div class="space-y-3 py-2">
										<div class="grid gap-3 sm:grid-cols-2">
											<label class="block text-sm">
												<span class={labelClass}>Start</span>
												<DateTimePicker bind:value={editStart} required />
											</label>
											<label class="block text-sm">
												<span class={labelClass}>Slut</span>
												<DateTimePicker bind:value={editEnd} required />
											</label>
										</div>
										<label class="block text-sm">
											<span class={labelClass}>Note</span>
											<input type="text" bind:value={editNotes} class={inputClass} />
										</label>
										<div class="flex gap-2 pt-1">
											<button
												onclick={() => handleSaveEdit(slot)}
												disabled={savingEdit}
												class="rounded-full bg-[#172420] px-5 py-2 text-sm font-semibold text-[#ECF0E9] transition hover:bg-[#46605A] disabled:opacity-50"
											>
												{savingEdit ? 'Gemmer…' : 'Gem'}
											</button>
											<button
												onclick={cancelEdit}
												disabled={savingEdit}
												class="rounded-full border border-[#172420]/12 px-5 py-2 text-sm text-[#46605A] transition hover:bg-[#172420]/5"
											>
												Annullér
											</button>
										</div>
									</div>
								{:else}
									<div class="flex flex-wrap items-center justify-between gap-3">
										<div class="min-w-0">
											<span class="text-sm text-[#172420] capitalize"
												>{formatTime(slot.startTimeUtc)} – {formatEndTime(slot.endTimeUtc)}</span
											>
											{#if slot.notes}
												<span class="ml-2 truncate font-['IBM_Plex_Mono'] text-xs text-[#46605A]/60"
													>{slot.notes}</span
												>
											{/if}
											{#if slot.bookedByUserEmail}
												<div class="mt-1 font-['IBM_Plex_Mono'] text-[10px] text-[#46605A]">
													{slot.bookedByUserEmail}
												</div>
											{/if}
										</div>
										<div class="flex shrink-0 items-center gap-3">
											<span
												class="rounded-full bg-[#96392C]/10 px-2.5 py-0.5 font-['IBM_Plex_Mono'] text-[10px] font-medium tracking-[0.06em] text-[#96392C] uppercase"
											>
												Booket
											</span>
											<button
												class="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-[#46605A]/70 uppercase transition hover:text-[#96392C] disabled:opacity-50"
												disabled={cancellingId === slot.id}
												onclick={() => handleCancelBooking(slot)}
											>
												{cancellingId === slot.id ? 'Aflyser…' : 'Aflys'}
											</button>
											<button
												class="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-[#46605A]/70 uppercase transition hover:text-[#172420]"
												onclick={() => startEdit(slot)}
											>
												Redigér
											</button>
											{#if confirmDeleteId === slot.id}
												<button
													class="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-[#96392C] uppercase disabled:opacity-50"
													disabled={deletingId === slot.id}
													onclick={() => handleDelete(slot)}
												>
													{deletingId === slot.id ? 'Sletter…' : 'Bekræft sletning'}
												</button>
												<button
													class="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-[#46605A]/70 uppercase"
													onclick={() => (confirmDeleteId = null)}
												>
													Fortryd
												</button>
											{:else}
												<button
													class="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-[#46605A]/70 uppercase transition hover:text-[#96392C]"
													title="Sletter tiden og fjerner brugerens booking"
													onclick={() => (confirmDeleteId = slot.id)}
												>
													Slet
												</button>
											{/if}
										</div>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<div class="mt-10">
				<div class="flex items-center justify-between">
					<h2
						class="font-['IBM_Plex_Mono'] text-[11px] font-semibold tracking-[0.2em] text-[#46605A] uppercase"
					>
						Ledig
					</h2>
					<span class="font-['IBM_Plex_Mono'] text-[10px] text-[#46605A]"
						>{availableSlots.length}</span
					>
				</div>

				{#if availableSlots.length === 0}
					<p class="mt-3 text-sm text-[#46605A]">Ingen ledige tider.</p>
				{:else}
					<ul
						class="mt-3 divide-y divide-[#172420]/6 rounded-[24px] border border-[#172420]/10 bg-white shadow-[0_15px_40px_-25px_rgba(23,36,32,0.35)]"
					>
						{#each availableSlots as slot (slot.id)}
							<li class="px-5 py-3.5">
								{#if editingId === slot.id}
									<div class="space-y-3 py-2">
										<div class="grid gap-3 sm:grid-cols-2">
											<label class="block text-sm">
												<span class={labelClass}>Start</span>
												<DateTimePicker bind:value={editStart} required />
											</label>
											<label class="block text-sm">
												<span class={labelClass}>Slut</span>
												<DateTimePicker bind:value={editEnd} required />
											</label>
										</div>
										<label class="block text-sm">
											<span class={labelClass}>Note</span>
											<input type="text" bind:value={editNotes} class={inputClass} />
										</label>
										<div class="flex gap-2 pt-1">
											<button
												onclick={() => handleSaveEdit(slot)}
												disabled={savingEdit}
												class="rounded-full bg-[#172420] px-5 py-2 text-sm font-semibold text-[#ECF0E9] transition hover:bg-[#46605A] disabled:opacity-50"
											>
												{savingEdit ? 'Gemmer…' : 'Gem'}
											</button>
											<button
												onclick={cancelEdit}
												disabled={savingEdit}
												class="rounded-full border border-[#172420]/12 px-5 py-2 text-sm text-[#46605A] transition hover:bg-[#172420]/5"
											>
												Annullér
											</button>
										</div>
									</div>
								{:else}
									<div class="flex flex-wrap items-center justify-between gap-3">
										<div class="min-w-0">
											<span class="text-sm text-[#172420] capitalize"
												>{formatTime(slot.startTimeUtc)} – {formatEndTime(slot.endTimeUtc)}</span
											>
											{#if slot.notes}
												<span class="ml-2 truncate font-['IBM_Plex_Mono'] text-xs text-[#46605A]/60"
													>{slot.notes}</span
												>
											{/if}
										</div>
										<div class="flex shrink-0 items-center gap-3">
											<span
												class="rounded-full bg-[#46605A]/10 px-2.5 py-0.5 font-['IBM_Plex_Mono'] text-[10px] font-medium tracking-[0.06em] text-[#46605A] uppercase"
											>
												Ledig
											</span>
											<button
												class="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-[#46605A]/70 uppercase transition hover:text-[#172420]"
												onclick={() => startEdit(slot)}
											>
												Redigér
											</button>
											<button
												class="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.08em] text-[#46605A]/70 uppercase transition hover:text-[#96392C] disabled:opacity-50"
												disabled={deletingId === slot.id}
												onclick={() => handleDelete(slot)}
											>
												{deletingId === slot.id ? 'Sletter…' : 'Slet'}
											</button>
										</div>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>
</section>
