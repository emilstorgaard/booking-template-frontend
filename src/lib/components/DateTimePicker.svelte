<script lang="ts">
	import { untrack } from 'svelte';

	let {
		value = $bindable(''),
		required = false,
		minuteStep = 5
	}: { value?: string; required?: boolean; minuteStep?: number } = $props();

	let date = $state('');
	let hour = $state('');
	let minute = $state('');

	$effect(() => {
		if (!value) return;
		const [d, t] = value.split('T');
		if (!d || !t) return;
		const [h, m] = t.split(':');
		untrack(() => {
			if (d !== date) date = d;
			if (h !== hour) hour = h;
			if (m !== minute) minute = m;
		});
	});

	$effect(() => {
		value = date && hour !== '' && minute !== '' ? `${date}T${hour}:${minute}` : '';
	});

	const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
	const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) =>
		(i * minuteStep).toString().padStart(2, '0')
	);

	const fieldClass =
		"mt-1 rounded-sm border border-[#172420]/20 px-3 py-2 font-['IBM_Plex_Mono'] text-sm text-[#172420] transition focus:border-[#96392C] focus:outline-none focus:ring-2 focus:ring-[#96392C]/25";
</script>

<div class="flex gap-2">
	<input type="date" bind:value={date} {required} lang="da" class="{fieldClass} min-w-0 flex-1" />
	<select bind:value={hour} {required} class="{fieldClass} w-20">
		<option value="" disabled selected>Time</option>
		{#each hours as h (h)}
			<option value={h}>{h}</option>
		{/each}
	</select>
	<span class="mt-1 flex items-center text-[#46605A]/60">:</span>
	<select bind:value={minute} {required} class="{fieldClass} w-20">
		<option value="" disabled selected>Min</option>
		{#each minutes as m (m)}
			<option value={m}>{m}</option>
		{/each}
	</select>
</div>
