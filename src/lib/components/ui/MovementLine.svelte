<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 400 24" preserveAspectRatio="none" class="h-6 w-full {className}" aria-hidden="true">
	<path
		d="M0,12 C40,2 60,22 100,12 C140,2 160,22 200,12 C240,2 260,22 300,12 C340,2 360,22 400,12"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
</svg>