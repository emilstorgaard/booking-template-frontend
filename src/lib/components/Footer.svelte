<script lang="ts">
	const nav = [
		{ href: '/om', label: 'Om os' },
		{ href: '/faq', label: 'FAQ' },
		{ href: '/book', label: 'Book tid' }
	];
</script>

<footer class="border-t border-[#172420]/8 bg-[#ECF0E9]">
	<div class="mx-auto max-w-6xl px-4 pt-16 pb-8">
		<div class="grid gap-10 sm:grid-cols-[1.6fr_1fr_1fr]">
			<div>
				<a href="/" class="inline-flex items-center gap-3">
					<img
						src="/logo.png"
						alt="logo"
						width="40"
						height="40"
						loading="lazy"
						decoding="async"
						class="h-10 w-10 rounded-full object-contain"
					/>
					<div>
						<span class="block font-['Instrument_Serif'] text-lg text-[#172420] italic">Booking Template</span>
						<span class="mt-0.5 block text-[11px] tracking-wide text-[#46605A]/60">Din undertekst her</span>
					</div>
				</a>
				<p class="mt-5 max-w-xs text-sm leading-relaxed text-[#46605A]">
					Enkel og fleksibel online booking — tilpasset din virksomhed og dine kunder.
				</p>
				<div class="mt-6 flex gap-2">
					<a
						href="https://www.instagram.com/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
						class="flex h-9 w-9 items-center justify-center rounded-full border border-[#172420]/10 text-[#46605A] transition hover:border-[#96392C]/40 hover:text-[#96392C]"
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
						</svg>
					</a>
					<a
						href="https://www.facebook.com/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook"
						class="flex h-9 w-9 items-center justify-center rounded-full border border-[#172420]/10 text-[#46605A] transition hover:border-[#96392C]/40 hover:text-[#96392C]"
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
						</svg>
					</a>
				</div>
			</div>

			<div>
				<p class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.18em] text-[#46605A]/55 uppercase">Sider</p>
				<ul class="mt-4 space-y-3">
					{#each nav as link}
						<li>
							<a href={link.href} class="text-sm text-[#46605A] transition hover:text-[#172420]">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<p class="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-[0.18em] text-[#46605A]/55 uppercase">Kontakt</p>
				<ul class="mt-4 space-y-3">
					<li>
						<a href="mailto:hej@example.dk" class="text-sm text-[#46605A] transition hover:text-[#172420]">hej@example.dk</a>
					</li>
					<li>
						<a href="/book" class="inline-flex items-center gap-1.5 text-sm font-medium text-[#96392C] transition hover:text-[#7e2f24]">
							Book en tid
							<svg viewBox="0 0 16 16" class="h-3 w-3" fill="none" aria-hidden="true">
								<path d="M2 8h10M8 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#172420]/8 pt-6 sm:flex-row">
			<p class="text-[11px] text-[#46605A]/50">
				© {new Date().getFullYear()} Booking Template. Alle rettigheder forbeholdes.
			</p>
			<div class="flex gap-5">
				<a href="/faq" class="text-[11px] text-[#46605A]/50 transition hover:text-[#46605A]">FAQ</a>
				<a href="/om" class="text-[11px] text-[#46605A]/50 transition hover:text-[#46605A]">Om os</a>
			</div>
		</div>
	</div>
</footer>