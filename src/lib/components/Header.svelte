<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoginModal from '$lib/components/LoginModal.svelte';
	import RegisterModal from '$lib/components/RegisterModal.svelte';
	import NavLink from '$lib/components/layout/NavLink.svelte';
	import MobileNavLink from '$lib/components/layout/MobileNavLink.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { userStore, hasRole } from '$lib/stores/auth';
	import { logout } from '$lib/utils/auth';
	import { triggerToast } from '$lib/stores/toastStore';
	import {
		authModalStore,
		openLoginModal,
		openRegisterModal,
		closeAuthModal
	} from '$lib/stores/modalStore';

	let isMenuOpen = $state(false);
	let headerEl = $state<HTMLElement | null>(null);

	const currentPath = $derived($page.url.pathname);

	function isActive(link: string): boolean {
		if (link === '/') return currentPath === '/';
		return currentPath === link || currentPath.startsWith(link + '/');
	}

	function handleOpenLogin() {
		isMenuOpen = false;
		openLoginModal();
	}

	function handleOpenRegister() {
		isMenuOpen = false;
		openRegisterModal();
	}

	async function handleLogout() {
		try {
			await logout();
			await goto('/');
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

	const navItems = [
		{ href: '/om', label: 'Om os' },
		{ href: '/faq', label: 'FAQ' }
	];
</script>

<header
	bind:this={headerEl}
	class="relative z-50 border-b border-[#172420]/8 bg-[#ECF0E9]/90 backdrop-blur-md"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between sm:h-[4.5rem] md:h-20">
			<a href="/" class="group flex items-center gap-3">
				<img
					src="/logo.png"
					sizes="48px"
					alt="logo"
					fetchpriority="high"
					loading="eager"
					decoding="async"
					width="48"
					height="48"
					class="h-8 w-auto rounded-full object-contain sm:h-9 md:h-10"
				/>
				<div class="min-w-0 text-left">
					<span class="block truncate font-['Instrument_Serif'] text-lg leading-tight text-[#172420] italic sm:text-xl">
						Booking Template
					</span>
					<span class="block truncate text-[10px] tracking-[0.14em] text-[#46605A]/70 uppercase">
						Din undertekst her
					</span>
				</div>
			</a>

			<nav
				class="hidden items-center gap-1 rounded-full border border-[#172420]/8 bg-white/60 p-1.5 backdrop-blur-sm xl:flex"
			>
				{#each navItems as item (item.href)}
					<NavLink href={item.href} active={isActive(item.href)}>{item.label}</NavLink>
				{/each}

				{#if $userStore && hasRole($userStore, 'Admin')}
					<NavLink href="/admin" active={isActive('/admin')}>Admin</NavLink>
				{/if}
			</nav>

			<div class="hidden items-center gap-5 xl:flex">
				{#if !$userStore}
					<button
						title="Log ind"
						onclick={handleOpenLogin}
						class="text-sm font-medium text-[#46605A] transition hover:text-[#172420]"
					>
						Log ind
					</button>
					<button
						title="Opret bruger"
						onclick={handleOpenRegister}
						class="text-sm font-medium text-[#46605A] transition hover:text-[#172420]"
					>
						Opret bruger
					</button>
				{:else}
					<button
						title="Log ud"
						onclick={handleLogout}
						class="text-sm font-medium text-[#46605A] transition hover:text-[#96392C]"
					>
						Log ud
					</button>
				{/if}

				<Button href="/book" size="sm">Book tid</Button>
			</div>

			<button
				onclick={() => (isMenuOpen = !isMenuOpen)}
				class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#172420]/10 text-[#172420] transition hover:bg-[#172420]/5 focus:outline-none xl:hidden"
				aria-label={isMenuOpen ? 'Luk menu' : 'Åbn menu'}
				aria-expanded={isMenuOpen}
			>
				{#if isMenuOpen}
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else}
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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
		<nav class="absolute top-full left-0 z-50 w-full border-t border-[#172420]/8 bg-[#ECF0E9] shadow-[0_25px_60px_-35px_rgba(23,36,32,0.35)] xl:hidden">
			<div class="mx-auto max-w-7xl px-4 py-4">
				<div class="pb-3">
					<a
						href="/book"
						onclick={() => (isMenuOpen = false)}
						class="block w-full rounded-full bg-[#172420] py-3 text-center text-sm font-semibold text-[#ECF0E9] transition hover:bg-[#46605A]"
					>
						Book tid
					</a>
				</div>

				<div class="space-y-1">
					{#each navItems as item (item.href)}
						<MobileNavLink href={item.href} active={isActive(item.href)} onclick={() => (isMenuOpen = false)}>
							{item.label}
						</MobileNavLink>
					{/each}

					{#if $userStore && hasRole($userStore, 'Admin')}
						<MobileNavLink href="/admin" active={isActive('/admin')} onclick={() => (isMenuOpen = false)}>
							Admin
						</MobileNavLink>
					{/if}
				</div>

				<div class="mt-3 space-y-2 border-t border-[#172420]/8 pt-3">
					{#if !$userStore}
						<button
							title="Log ind"
							onclick={handleOpenLogin}
							class="block w-full rounded-2xl border border-[#172420]/12 py-3 text-center text-sm font-semibold text-[#172420] transition hover:bg-[#172420]/5"
						>
							Log ind
						</button>
						<button
							title="Opret bruger"
							onclick={handleOpenRegister}
							class="block w-full py-2 text-center text-sm font-medium text-[#46605A] transition hover:text-[#172420]"
						>
							Opret bruger
						</button>
					{:else}
						<button
							title="Log ud"
							onclick={() => {
								isMenuOpen = false;
								handleLogout();
							}}
							class="block w-full rounded-2xl border border-[#96392C]/25 py-3 text-center text-sm font-semibold text-[#96392C] transition hover:bg-[#96392C]/5"
						>
							Log ud
						</button>
					{/if}
				</div>
			</div>
		</nav>
	{/if}
</header>

{#if $authModalStore === 'login'}
	<LoginModal onclose={closeAuthModal} onSwitchToRegister={openRegisterModal} />
{:else if $authModalStore === 'register'}
	<RegisterModal onclose={closeAuthModal} onSwitchToLogin={openLoginModal} />
{/if}