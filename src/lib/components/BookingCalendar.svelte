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

	let slotsByDay = $derived.by(() => {
		const map = new Map<string, TimeSlot[]>();
		for (const slot of slots) {
			const key = dateKey(new Date(slot.startTimeUtc));
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(slot);
		}
		for (const list of map.values()) {
			list.sort((a, b) => new Date(a.startTimeUtc).getTime() - new Date(b.startTimeUtc).getTime());
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
		return new Date(iso).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
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
		const start = new Date(slot.startTimeUtc).toLocaleTimeString('da-DK', {
			hour: '2-digit',
			minute: '2-digit'
		});
		const end = new Date(slot.endTimeUtc).toLocaleTimeString('da-DK', {
			hour: '2-digit',
			minute: '2-digit'
		});
		return `${start} – ${end}`;
	}
</script>

<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
	<div class="grid md:grid-cols-[1fr_auto]">
		<div class="p-4 sm:p-5">
			<div class="flex items-center justify-between">
				<button
					onclick={prevMonth}
					aria-label="Forrige måned"
					class="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
				>
					‹
				</button>
				<span class="font-display text-base font-medium capitalize text-slate-800"
					>{monthLabel}</span
				>
				<button
					onclick={nextMonth}
					aria-label="Næste måned"
					class="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
				>
					›
				</button>
			</div>

			<div class="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
				{#each WEEKDAY_LABELS as label}
					<span class="py-1">{label}</span>
				{/each}
			</div>

			<div class="grid grid-cols-7 gap-1">
				{#each calendarCells as cell (cell.key)}
					{@const disabled = cell.slotCount === 0 || cell.isPast}
					<button
						onclick={() => selectDay(cell)}
						{disabled}
						class="relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition
							{!cell.inCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
							{disabled ? 'cursor-default' : 'hover:bg-brand-50'}
							{selectedDateKey === cell.key ? 'bg-brand-500 text-white hover:bg-brand-500' : ''}
							{cell.isToday && selectedDateKey !== cell.key ? 'ring-1 ring-inset ring-brand-200' : ''}"
					>
						{cell.date.getDate()}
						{#if cell.slotCount > 0}
							<span
								class="mt-0.5 h-1 w-1 rounded-full
									{selectedDateKey === cell.key ? 'bg-white' : 'bg-tide'}"
							></span>
						{/if}
					</button>
				{/each}
			</div>

			<p class="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
				<span class="h-1 w-1 rounded-full bg-tide"></span>
				Ledige tider
			</p>
		</div>

		<div class="border-t border-slate-200 p-4 sm:p-5 md:w-64 md:border-t-0 md:border-l">
			{#if !selectedDateKey}
				<p class="text-sm text-slate-500">Vælg en markeret dag for at se ledige tider.</p>
			{:else}
				<h3 class="font-display text-base font-medium capitalize text-slate-800">
					{formatSelectedDate()}
				</h3>
				{#if selectedDaySlots.length === 0}
					<p class="mt-2 text-sm text-slate-500">Ingen ledige tider denne dag.</p>
				{:else}
					<ul class="mt-3 flex flex-wrap gap-2">
						{#each selectedDaySlots as slot (slot.id)}
							<li>
								<button
									onclick={() => onBook(slot)}
									disabled={pendingId === slot.id}
									class="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:border-brand-500 hover:bg-brand-500 hover:text-white disabled:opacity-50"
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
