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
		{ href: '/ydelser', label: 'Ydelser' },
		{ href: '/faq', label: 'FAQ' }
	];
</script>

<header
	bind:this={headerEl}
	class="relative z-50 border-b border-white/20 bg-white/80 shadow-sm backdrop-blur-md transition-all"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between sm:h-18 md:h-20">
			<a href="/" class="group flex items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3">
				<img
					src="/logo.png"
					sizes="48px"
					alt="logo"
					fetchpriority="high"
					loading="eager"
					decoding="async"
					width="48"
					height="48"
					class="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-9 md:h-10"
				/>
				<div class="min-w-0 text-left">
					<span class="block truncate text-sm leading-tight font-bold text-gray-500 sm:text-base md:text-lg">
						Booking Template
					</span>
					<span class="block truncate text-[10px] font-medium tracking-wide text-brand-600 sm:text-xs">
						Emil Storgaard Andersen
					</span>
				</div>
			</a>

			<nav class="hidden items-center gap-1 xl:flex">
				{#each navItems as item (item.href)}
					<NavLink href={item.href} active={isActive(item.href)}>{item.label}</NavLink>
				{/each}

				{#if $userStore && hasRole($userStore, 'Admin')}
					<NavLink href="/admin" active={isActive('/admin')}>Admin</NavLink>
				{/if}

				{#if !$userStore}
					<button
						title="Log ind"
						onclick={handleOpenLogin}
						class="rounded-full px-5 py-2.5 text-base font-semibold text-gray-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-600"
					>
						Log ind
					</button>
					<button
						title="Opret bruger"
						onclick={handleOpenRegister}
						class="rounded-full px-5 py-2.5 text-base font-semibold text-gray-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-600"
					>
						Opret bruger
					</button>
				{:else}
					<button
						title="Log ud"
						onclick={handleLogout}
						class="rounded-full px-5 py-2.5 text-base font-semibold text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
					>
						Log ud
					</button>
				{/if}

				<Button href="/book" size="sm" class="ml-4">Book tid</Button>
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
		<nav class="absolute top-full left-0 z-50 w-full border-t border-gray-100 bg-white/98 shadow-lg backdrop-blur-md xl:hidden">
			<div class="mx-auto max-w-7xl px-4 py-3">
				<div class="pb-3">
					<a
						href="/book"
						onclick={() => (isMenuOpen = false)}
						class="block w-full rounded-full bg-tide py-3 text-center font-semibold text-white transition hover:bg-tide/90"
					>
						Book tid
					</a>
				</div>

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

				{#if !$userStore}
					<button
						title="Log ind"
						onclick={handleOpenLogin}
						class="mt-3 block w-full rounded-full bg-brand-500 py-3 text-center font-semibold text-white transition hover:bg-brand-400"
					>
						Log ind
					</button>
					<button
						title="Opret bruger"
						onclick={handleOpenRegister}
						class="mt-3 block w-full rounded-full border border-brand-500 py-3 text-center font-semibold text-brand-600 transition hover:bg-brand-50"
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
						class="mt-3 block w-full rounded-full bg-red-600 py-3 text-center font-semibold text-white transition hover:bg-red-500"
					>
						Log ud
					</button>
				{/if}
			</div>
		</nav>
	{/if}
</header>

{#if $authModalStore === 'login'}
	<LoginModal onclose={closeAuthModal} onSwitchToRegister={openRegisterModal} />
{:else if $authModalStore === 'register'}
	<RegisterModal onclose={closeAuthModal} onSwitchToLogin={openLoginModal} />
{/if}