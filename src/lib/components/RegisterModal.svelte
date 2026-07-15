<script lang="ts">
	import { triggerToast } from '$lib/stores/toastStore';
	import { signup, login } from '$lib/utils/auth';
	import { fetchUserData } from '$lib/utils/user';
	import Modal from './Modal.svelte';

	let { onclose, onSwitchToLogin }: { onclose: () => void; onSwitchToLogin?: () => void } =
		$props();

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isSubmitting = $state(false);

	async function handleRegister(event: SubmitEvent) {
		event.preventDefault();
		if (isSubmitting) return;

		isSubmitting = true;
		try {
			await signup(email, password, confirmPassword);

			await login(email, password);
			await fetchUserData();

			triggerToast('Din bruger er oprettet!', 'success');
			onclose();
		} catch (error: any) {
			triggerToast(error?.message ?? 'Oprettelse mislykkedes. Prøv igen.', 'error');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Modal title="Opret bruger" {onclose}>
	<form onsubmit={handleRegister} class="space-y-4 md:space-y-6">
		<div>
			<label for="register-email" class="mb-2 block text-sm font-medium text-[#cfc9bb]">Email</label
			>
			<input
				type="email"
				name="email"
				bind:value={email}
				id="register-email"
				autocomplete="email"
				disabled={isSubmitting}
				class="block w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-[#f2ede1] placeholder-[#cfc9bb]/50 transition focus:border-[#c1602e] focus:outline-none focus:ring-2 focus:ring-[#c1602e]/40 disabled:opacity-50"
				placeholder="jens@jensen.com"
				required
			/>
		</div>
		<div>
			<label for="register-password" class="mb-2 block text-sm font-medium text-[#cfc9bb]"
				>Adgangskode</label
			>
			<input
				type="password"
				name="password"
				bind:value={password}
				id="register-password"
				autocomplete="new-password"
				disabled={isSubmitting}
				placeholder="••••••••"
				class="block w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-[#f2ede1] placeholder-[#cfc9bb]/50 transition focus:border-[#c1602e] focus:outline-none focus:ring-2 focus:ring-[#c1602e]/40 disabled:opacity-50"
				required
			/>
		</div>
		<div>
			<label for="register-confirm-password" class="mb-2 block text-sm font-medium text-[#cfc9bb]">
				Gentag adgangskode
			</label>
			<input
				type="password"
				name="confirmPassword"
				bind:value={confirmPassword}
				id="register-confirm-password"
				autocomplete="new-password"
				disabled={isSubmitting}
				placeholder="••••••••"
				class="block w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-[#f2ede1] placeholder-[#cfc9bb]/50 transition focus:border-[#c1602e] focus:outline-none focus:ring-2 focus:ring-[#c1602e]/40 disabled:opacity-50"
				required
			/>
		</div>

		<button
			type="submit"
			title="Opret bruger"
			disabled={isSubmitting}
			class="flex w-full items-center justify-center gap-2 rounded-full bg-[#c1602e] px-4 py-2.5 font-semibold text-[#f2ede1] transition duration-300 ease-in-out hover:bg-[#d1712f] disabled:cursor-not-allowed disabled:opacity-60"
		>
			{#if isSubmitting}
				<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
				</svg>
				Opretter...
			{:else}
				Opret bruger
			{/if}
		</button>

		{#if onSwitchToLogin}
			<p class="text-center text-sm text-[#cfc9bb]">
				Har du allerede en bruger?
				<button
					type="button"
					onclick={onSwitchToLogin}
					class="font-semibold text-[#c1602e] hover:text-[#d1712f] hover:underline"
				>
					Log ind
				</button>
			</p>
		{/if}
	</form>
</Modal>
