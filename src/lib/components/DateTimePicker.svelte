<script lang="ts">
	let {
		value = $bindable(''),
		required = false,
		minuteStep = 5
	}: { value?: string; required?: boolean; minuteStep?: number } = $props();

	let date = $state('');
	let hour = $state('');
	let minute = $state('');

	// Værdien parent'en ser er altid "YYYY-MM-DDTHH:mm" (samme format som datetime-local gav)
	$effect(() => {
		value = date && hour !== '' && minute !== '' ? `${date}T${hour}:${minute}` : '';
	});

	const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
	const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) =>
		(i * minuteStep).toString().padStart(2, '0')
	);

	const fieldClass =
		'mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';
</script>

<div class="flex gap-2">
	<input type="date" bind:value={date} {required} lang="da" class="{fieldClass} min-w-0 flex-1" />
	<select bind:value={hour} {required} class="{fieldClass} w-20">
		<option value="" disabled selected>Time</option>
		{#each hours as h (h)}
			<option value={h}>{h}</option>
		{/each}
	</select>
	<span class="mt-1 flex items-center text-slate-400">:</span>
	<select bind:value={minute} {required} class="{fieldClass} w-20">
		<option value="" disabled selected>Min</option>
		{#each minutes as m (m)}
			<option value={m}>{m}</option>
		{/each}
	</select>
</div>