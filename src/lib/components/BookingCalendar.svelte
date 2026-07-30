<script lang="ts">
	import type { TimeSlot } from '$lib/api/booking';
	import Spinner from '$lib/components/Spinner.svelte';

	let {
		slots,
		pendingId,
		onBook
	}: {
		slots: TimeSlot[];
		pendingId: number | null;
		onBook: (slot: TimeSlot) => void;
	} = $props();

	const WEEKDAY_LABELS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

	let viewDate = $state(startOfMonth(new Date()));
	let selectedDateKey = $state<string | null>(null);

	function startOfMonth(d: Date): Date {
		return new Date(d.getFullYear(), d.getMonth(), 1);
	}

	function dateKey(d: Date): string {
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	}

	function isSameDay(a: Date, b: Date): boolean {
		return dateKey(a) === dateKey(b);
	}

	function parseAsUtc(iso: string): Date {
		const hasTimezoneInfo = /Z$|[+-]\d{2}:?\d{2}$/.test(iso);
		return new Date(hasTimezoneInfo ? iso : `${iso}Z`);
	}

	let slotsByDay = $derived.by(() => {
		const map = new Map<string, TimeSlot[]>();
		for (const slot of slots) {
			const key = dateKey(parseAsUtc(slot.startTimeUtc));
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(slot);
		}
		for (const list of map.values()) {
			list.sort((a, b) => parseAsUtc(a.startTimeUtc).getTime() - parseAsUtc(b.startTimeUtc).getTime());
		}
		return map;
	});

	let calendarCells = $derived.by(() => {
		const first = startOfMonth(viewDate);
		const offset = (first.getDay() + 6) % 7;
		const gridStart = new Date(first);
		gridStart.setDate(gridStart.getDate() - offset);

		const today = new Date();
		const cells = [];
		for (let i = 0; i < 42; i++) {
			const date = new Date(gridStart);
			date.setDate(gridStart.getDate() + i);
			const key = dateKey(date);
			cells.push({
				date,
				key,
				inCurrentMonth: date.getMonth() === viewDate.getMonth(),
				isToday: isSameDay(date, today),
				isPast: date < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
				slotCount: slotsByDay.get(key)?.length ?? 0
			});
		}
		return cells;
	});

	let selectedDaySlots = $derived(selectedDateKey ? (slotsByDay.get(selectedDateKey) ?? []) : []);

	let monthLabel = $derived(
		viewDate.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' })
	);

	function prevMonth() {
		viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
	}

	function nextMonth() {
		viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
	}

	function selectDay(cell: (typeof calendarCells)[number]) {
		if (cell.slotCount === 0) return;
		selectedDateKey = cell.key;
	}

	function formatTime(iso: string): string {
		return parseAsUtc(iso).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
	}

	function formatSelectedDate(): string {
		if (!selectedDateKey) return '';
		const [y, m, d] = selectedDateKey.split('-').map(Number);
		return new Date(y, m - 1, d).toLocaleDateString('da-DK', {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		});
	}

	$effect(() => {
		if (selectedDateKey && (slotsByDay.get(selectedDateKey)?.length ?? 0) > 0) return;
		const firstAvailable = calendarCells.find((c) => c.slotCount > 0 && !c.isPast);
		selectedDateKey = firstAvailable?.key ?? null;
	});

	function formatTimeRange(slot: TimeSlot): string {
		const start = parseAsUtc(slot.startTimeUtc).toLocaleTimeString('da-DK', {
			hour: '2-digit',
			minute: '2-digit'
		});
		const end = parseAsUtc(slot.endTimeUtc).toLocaleTimeString('da-DK', {
			hour: '2-digit',
			minute: '2-digit'
		});
		return `${start} – ${end}`;
	}
</script>

<div class="overflow-hidden rounded-[28px] border border-[#172420]/8 bg-white shadow-[0_25px_60px_-35px_rgba(23,36,32,0.35)]">
	<div class="grid md:grid-cols-[1fr_auto]">
		<div class="p-5 sm:p-7">
			<div class="flex items-center justify-between">
				<button
					onclick={prevMonth}
					aria-label="Forrige måned"
					class="flex h-9 w-9 items-center justify-center rounded-full border border-[#172420]/10 text-[#46605A] transition hover:border-[#172420]/20 hover:bg-[#172420]/5 hover:text-[#172420]"
				>
					<svg viewBox="0 0 20 20" fill="none" class="h-4 w-4" aria-hidden="true">
						<path d="M12 5l-5 5 5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
				<span class="font-['Instrument_Serif'] text-xl text-[#172420] italic capitalize">{monthLabel}</span>
				<button
					onclick={nextMonth}
					aria-label="Næste måned"
					class="flex h-9 w-9 items-center justify-center rounded-full border border-[#172420]/10 text-[#46605A] transition hover:border-[#172420]/20 hover:bg-[#172420]/5 hover:text-[#172420]"
				>
					<svg viewBox="0 0 20 20" fill="none" class="h-4 w-4" aria-hidden="true">
						<path d="M8 5l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
			</div>

			<div class="mt-5 grid grid-cols-7 gap-1 text-center">
				{#each WEEKDAY_LABELS as label}
					<span class="py-1 font-['IBM_Plex_Mono'] text-[10px] font-medium tracking-wider text-[#46605A]/50 uppercase">{label}</span>
				{/each}
			</div>

			<div class="grid grid-cols-7 gap-1">
				{#each calendarCells as cell (cell.key)}
					{@const disabled = cell.slotCount === 0 || cell.isPast}
					<button
						onclick={() => selectDay(cell)}
						{disabled}
						class="relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition
							{!cell.inCurrentMonth ? 'text-[#172420]/20' : 'text-[#172420]'}
							{disabled ? 'cursor-default' : 'hover:bg-[#172420]/5'}
							{selectedDateKey === cell.key ? 'bg-[#96392C] font-semibold text-white hover:bg-[#96392C]' : ''}
							{cell.isToday && selectedDateKey !== cell.key ? 'ring-1 ring-inset ring-[#96392C]/40' : ''}"
					>
						{cell.date.getDate()}
						{#if cell.slotCount > 0 && !cell.isPast}
							<span
								class="mt-0.5 h-1 w-1 rounded-full {selectedDateKey === cell.key ? 'bg-white/80' : 'bg-[#96392C]'}"
							></span>
						{/if}
					</button>
				{/each}
			</div>

			<p class="mt-4 flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[10px] tracking-wide text-[#46605A]/60 uppercase">
				<span class="h-1.5 w-1.5 rounded-full bg-[#96392C]"></span>
				Ledige tider
			</p>
		</div>

		<div class="border-t border-[#172420]/8 p-5 sm:p-7 md:w-72 md:border-t-0 md:border-l">
			{#if !selectedDateKey}
				<div class="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#172420]/5 text-[#172420]/30">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
							<rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" stroke-width="1.6" />
							<path d="M3.5 9.5H20.5" stroke="currentColor" stroke-width="1.6" />
							<path d="M7.5 3V6.5M16.5 3V6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
						</svg>
					</div>
					<p class="text-sm text-[#46605A]">Vælg en markeret<br />dag for at se tider.</p>
				</div>
			{:else}
				<h3 class="font-['Instrument_Serif'] text-xl text-[#172420] italic capitalize">{formatSelectedDate()}</h3>
				{#if selectedDaySlots.length === 0}
					<p class="mt-3 text-sm text-[#46605A]">Ingen ledige tider denne dag.</p>
				{:else}
					<p class="mt-1 font-['IBM_Plex_Mono'] text-[10px] text-[#46605A]/60">{selectedDaySlots.length} ledig{selectedDaySlots.length === 1 ? '' : 'e'} tid{selectedDaySlots.length === 1 ? '' : 'er'}</p>
					<ul class="mt-4 flex flex-wrap gap-2">
						{#each selectedDaySlots as slot (slot.id)}
							<li>
								<button
									onclick={() => onBook(slot)}
									disabled={pendingId === slot.id}
									class="inline-flex items-center gap-1.5 rounded-full border border-[#172420]/12 px-4 py-2 font-['IBM_Plex_Mono'] text-sm text-[#172420] transition hover:border-[#172420] hover:bg-[#172420] hover:text-white disabled:opacity-50"
								>
									{#if pendingId === slot.id}
										<Spinner class="h-3.5 w-3.5" />
										Booker…
									{:else}
										{formatTimeRange(slot)}
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			{/if}
		</div>
	</div>
</div>