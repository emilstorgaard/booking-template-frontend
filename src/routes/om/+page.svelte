<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import CtaBand from '$lib/components/sections/CtaBand.svelte';
	import { team } from '$lib/data/team';
</script>

<SeoHead seo={{ metaTitle: 'Om os', metaDescription: 'Lær klinikken og teamet bag at kende.' }} />

<div class="mx-auto max-w-3xl px-4 py-14 sm:py-20">
	<span class="text-xs font-semibold tracking-wide text-tide uppercase">Om os</span>
	<h1 class="font-display mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
		Faglighed, ro og tid til dig
	</h1>
	<p class="mt-4 max-w-xl text-slate-600">
		Vi er en klinik med fokus på sundhed og velvære, hvor behandling tager udgangspunkt i dig og
		din krop — ikke en fast skabelon. Herunder kan du læse mere om, hvem der står bag.
	</p>
</div>

<section class="border-t border-slate-100 bg-slate-50/60">
	<div class="mx-auto max-w-3xl px-4 py-10 sm:py-14">
		<SectionHeading eyebrow="Teamet" title="Mød dem, der behandler dig" />
		<div class="mt-8 grid gap-5 sm:grid-cols-3">
			{#each team as member (member.id)}
				<Card class="text-center">
					<div class="mx-auto h-20 w-20 rounded-full bg-tide/10" aria-hidden="true"></div>
					<h3 class="font-display mt-4 text-base font-semibold text-slate-900">{member.name}</h3>
					<p class="text-xs font-medium tracking-wide text-tide uppercase">{member.title}</p>
					<p class="mt-2 text-sm leading-relaxed text-slate-500">{member.bio}</p>
				</Card>
			{/each}
		</div>
	</div>
</section>

<CtaBand title="Klar til at booke en tid hos os?" text="Vi glæder os til at hjælpe dig videre." />