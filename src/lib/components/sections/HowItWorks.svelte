<script lang="ts">
	const steps = [
		{ n: '01', title: 'Vælg en dag', text: 'Se de kommende uger, og find en dag der passer dig.' },
		{ n: '02', title: 'Vælg et tidspunkt', text: 'Klik på et ledigt tidspunkt — kun åbne tider vises.' },
		{ n: '03', title: 'Bekræft', text: 'Bekræft bookingen med ét klik. Du kan altid ændre den igen.' }
	];
</script>

<section class="mx-auto max-w-3xl px-4 py-10 sm:py-14">
	<h2 class="text-xs font-semibold tracking-wide text-slate-400 uppercase">Sådan foregår det</h2>
	<ol class="mt-6 grid gap-8 sm:grid-cols-3 sm:gap-6">
		{#each steps as step}
			<li>
				<span class="font-mono text-sm text-tide">{step.n}</span>
				<h3 class="font-display mt-2 text-lg font-medium text-slate-900">{step.title}</h3>
				<p class="mt-1.5 text-sm leading-relaxed text-slate-600">{step.text}</p>
			</li>
		{/each}
	</ol>
</section>