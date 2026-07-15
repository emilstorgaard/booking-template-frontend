<script lang="ts">
	import { onMount } from 'svelte';
	import LoginModal from '$lib/components/LoginModal.svelte';
	import RegisterModal from '$lib/components/RegisterModal.svelte';
	import { userStore, hasRole } from '$lib/stores/auth';
	import { logout } from '$lib/utils/auth';
	import { triggerToast } from '$lib/stores/toastStore';

	let isMenuOpen = $state(false);
	let headerEl = $state<HTMLElement | null>(null);

	let activeModal = $state<'login' | 'register' | null>(null);

	function openLoginModal() {
		isMenuOpen = false;
		activeModal = 'login';
	}

	function openRegisterModal() {
		isMenuOpen = false;
		activeModal = 'register';
	}

	function closeModal() {
		activeModal = null;
	}

	async function handleLogout() {
		try {
			await logout();
		} catch (error: any) {
			triggerToast(error.message, 'error');
		}
	}

	onMount(() => {
		const handlePointerDown = (event: PointerEvent) => {
			if (!isMenuOpen) return;
			if (headerEl && !headerEl.contains(event.target as Node)) {
				isMenuOpen = false;
			}
		};

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isMenuOpen) {
				isMenuOpen = false;
			}
		};

		document.addEventListener('pointerdown', handlePointerDown);
		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<header
	bind:this={headerEl}
	class="relative z-50 border-b border-white/20 bg-white/80 shadow-sm backdrop-blur-md transition-all"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-20 items-center justify-between sm:h-24 md:h-28 lg:h-32">
			<a
				href="/"
				class="group flex items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3"
			>
				<img
					src="logo.png"
					sizes="96px"
					alt="logo"
					fetchpriority="high"
					loading="eager"
					decoding="async"
					width="96"
					height="96"
					class="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-16 md:h-20 lg:h-24"
				/>
				<div class="min-w-0 text-left">
					<span
						class="block truncate text-base leading-tight font-bold text-gray-500 sm:text-xl md:text-2xl lg:text-3xl"
					>
						Booking Template
					</span>
					<span
						class="block truncate text-[10px] font-medium tracking-wide text-brand-600 sm:text-xs md:text-sm lg:text-base"
					>
						Emil Storgaard Andersen
					</span>
				</div>
			</a>

			<nav class="hidden items-center gap-1 xl:flex">
				<a
					href="/#"
					class="group relative rounded-full px-5 py-2.5 text-base font-semibold transition-all duration-200 hover:bg-brand-50 hover:text-brand-60 text-gray-600"
				>
					Om
					<span
						class="absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-brand-500 transition-all duration-300 w-0 group-hover:w-4/5"
					></span>
				</a>

				{#if $userStore && hasRole($userStore, 'Admin')}
					<a
						href="/admin"
						class="rounded-full px-5 py-2.5 text-base font-semibold text-gray-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-600"
					>
						Admin
					</a>
				{/if}

				{#if !$userStore}
					<button
						title="Login"
						onclick={openLoginModal}
						class="rounded-full px-5 py-2.5 text-base font-semibold text-gray-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-600"
					>
						Log in
					</button>
					<button
						title="Opret bruger"
						onclick={openRegisterModal}
						class="rounded-full px-5 py-2.5 text-base font-semibold text-gray-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-600"
					>
						Opret bruger
					</button>
				{:else}
					<button
						title="Logout"
						onclick={handleLogout}
						class="block w-full text-left px-4 py-2 text-sm text-light-gray hover:text-white hover:bg-red-600 rounded transition duration-200"
					>
						Log out
					</button>
				{/if}

				<a
					href="/#"
					class="ml-4 rounded-full px-6 py-3 text-base font-semibold text-black shadow-md shadow-brand-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/30 bg-brand-500 hover:bg-brand-400"
				>
					Kontakt
				</a>
			</nav>

			<button
				onclick={() => (isMenuOpen = !isMenuOpen)}
				class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-brand-100 hover:text-brand-600 focus:outline-none xl:hidden"
				aria-label={isMenuOpen ? 'Luk menu' : 'Åbn menu'}
				aria-expanded={isMenuOpen}
			>
				{#if isMenuOpen}
					<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else}
					<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	{#if isMenuOpen}
		<nav
			class="absolute top-full left-0 z-50 w-full border-t border-gray-100 bg-white/98 shadow-lg backdrop-blur-md xl:hidden"
		>
			<div class="mx-auto max-w-7xl px-4 py-3">
				<div class="mt-3 border-t border-gray-100 pt-3">
					<a
						href="/#"
						onclick={() => (isMenuOpen = false)}
						class="block w-full rounded-full py-3 text-center font-semibold text-white transition bg-brand-500 hover:bg-brand-400"
					>
						Kontakt
					</a>
				</div>

				<a
					href="/#"
					onclick={() => (isMenuOpen = false)}
					class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition hover:bg-brand-50 hover:text-brand-600 text-gray-700"
				>
					<span class="h-1.5 w-1.5 rounded-full transition-all bg-brand-400"></span>
					Om
				</a>

				{#if $userStore && hasRole($userStore, 'Admin')}
					<a
						href="/admin"
						onclick={() => (isMenuOpen = false)}
						class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition hover:bg-brand-50 hover:text-brand-600 text-gray-700"
					>
						<span class="h-1.5 w-1.5 rounded-full transition-all bg-brand-400"></span>
						Admin
					</a>
				{/if}

				{#if !$userStore}
					<button
						title="Login"
						onclick={openLoginModal}
						class="mt-3 block w-full rounded-full bg-brand-500 py-3 text-center font-semibold text-black transition hover:bg-brand-400"
					>
						Log in
					</button>
					<button
						title="Opret bruger"
						onclick={openRegisterModal}
						class="mt-3 block w-full rounded-full border border-brand-500 py-3 text-center font-semibold text-brand-600 transition hover:bg-brand-50"
					>
						Opret bruger
					</button>
				{:else}
					<button
						title="Logout"
						onclick={() => {
							isMenuOpen = false;
							handleLogout();
						}}
						class="mt-3 block w-full rounded-full bg-red-600 py-3 text-center font-semibold text-white transition hover:bg-red-500"
					>
						Log out
					</button>
				{/if}
			</div>
		</nav>
	{/if}
</header>

{#if activeModal === 'login'}
	<LoginModal onclose={closeModal} onSwitchToRegister={openRegisterModal} />
{:else if activeModal === 'register'}
	<RegisterModal onclose={closeModal} onSwitchToLogin={openLoginModal} />
{/if}
