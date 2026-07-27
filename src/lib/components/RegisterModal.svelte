<script lang="ts">
	import { triggerToast } from '$lib/stores/toastStore';
	import { signup, login } from '$lib/utils/auth';
	import { fetchUserData } from '$lib/utils/user';
	import Modal from './Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

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
			await signup({ email, password, confirmPassword });
			await login({ email, password });
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
	<form onsubmit={handleRegister} class="space-y-5">
		<div>
			<label for="register-email" class="mb-1.5 block text-[13px] font-medium text-[#46605A]">Email</label>
			<input
				type="email"
				name="email"
				bind:value={email}
				id="register-email"
				autocomplete="email"
				disabled={isSubmitting}
				class="block w-full rounded-2xl border border-[#172420]/12 bg-white p-3 text-[#172420] placeholder-[#46605A]/40 transition focus:border-[#96392C] focus:ring-2 focus:ring-[#96392C]/20 focus:outline-none disabled:opacity-50"
				placeholder="jens@jensen.com"
				required
			/>
		</div>
		<div>
			<label for="register-password" class="mb-1.5 block text-[13px] font-medium text-[#46605A]">Adgangskode</label>
			<input
				type="password"
				name="password"
				bind:value={password}
				id="register-password"
				autocomplete="new-password"
				disabled={isSubmitting}
				placeholder="••••••••"
				class="block w-full rounded-2xl border border-[#172420]/12 bg-white p-3 text-[#172420] placeholder-[#46605A]/40 transition focus:border-[#96392C] focus:ring-2 focus:ring-[#96392C]/20 focus:outline-none disabled:opacity-50"
				required
			/>
		</div>
		<div>
			<label for="register-confirm-password" class="mb-1.5 block text-[13px] font-medium text-[#46605A]">
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
				class="block w-full rounded-2xl border border-[#172420]/12 bg-white p-3 text-[#172420] placeholder-[#46605A]/40 transition focus:border-[#96392C] focus:ring-2 focus:ring-[#96392C]/20 focus:outline-none disabled:opacity-50"
				required
			/>
		</div>

		<Button type="submit" size="lg" disabled={isSubmitting} class="w-full">
			{#if isSubmitting}
				<Spinner class="h-4 w-4" />
				Opretter…
			{:else}
				Opret bruger
			{/if}
		</Button>

		{#if onSwitchToLogin}
			<p class="text-center text-sm text-[#46605A]">
				Har du allerede en bruger?
				<button
					type="button"
					onclick={onSwitchToLogin}
					class="font-semibold text-[#96392C] underline decoration-[#96392C]/30 underline-offset-2 hover:decoration-[#96392C]"
				>
					Log ind
				</button>
			</p>
		{/if}
	</form>
</Modal>