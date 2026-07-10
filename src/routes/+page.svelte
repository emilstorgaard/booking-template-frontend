<script lang="ts">
	interface RitualStep {
		phase: string;
		value: string;
		duration: string;
		desc: string;
	}

	interface Slot {
		time: string;
		session: string;
		spots: string;
		status: 'open' | 'few' | 'full';
	}

	interface DaySchedule {
		label: string;
		slots: Slot[];
	}

	interface Facility {
		name: string;
		tag: string;
		desc: string;
		icon: 'flame' | 'snow' | 'wave' | 'leaf';
	}

	interface Tier {
		name: string;
		price: string;
		period: string;
		desc: string;
		features: string[];
		featured?: boolean;
	}

	const ritual: RitualStep[] = [
		{
			phase: 'Sauna',
			value: '90°C',
			duration: '15 min',
			desc: 'Wood-fired heat. Top bench is for the brave, bottom bench for everyone else.'
		},
		{
			phase: 'Plunge',
			value: '4°C',
			duration: '90 sec',
			desc: 'Straight into the fjord off the timber deck. The cold is the entire point.'
		},
		{
			phase: 'Rest',
			value: 'Ambient',
			duration: '10 min',
			desc: 'Wool blankets, birch tea, and a room where no one is expected to talk.'
		}
	];

	const schedule: DaySchedule[] = [
		{
			label: 'Today',
			slots: [
				{ time: '07:00', session: 'Sauna A — Wood-fired', spots: 'Open', status: 'open' },
				{ time: '08:30', session: 'Plunge Deck', spots: '3 left', status: 'few' },
				{ time: '10:00', session: 'Sauna B — Panorama', spots: 'Open', status: 'open' },
				{ time: '12:00', session: 'Quiet Room', spots: 'Full', status: 'full' },
				{ time: '17:30', session: 'Sauna A — Wood-fired', spots: '2 left', status: 'few' },
				{ time: '19:00', session: 'Plunge Deck', spots: 'Open', status: 'open' }
			]
		},
		{
			label: 'Tomorrow',
			slots: [
				{ time: '07:00', session: 'Sauna B — Panorama', spots: 'Open', status: 'open' },
				{ time: '08:30', session: 'Plunge Deck', spots: 'Open', status: 'open' },
				{ time: '10:00', session: 'Sauna A — Wood-fired', spots: '4 left', status: 'few' },
				{ time: '12:00', session: 'Quiet Room', spots: 'Open', status: 'open' },
				{ time: '17:30', session: 'Sauna B — Panorama', spots: 'Full', status: 'full' },
				{ time: '19:00', session: 'Plunge Deck', spots: '1 left', status: 'few' }
			]
		},
		{
			label: 'Sunday',
			slots: [
				{ time: '08:00', session: 'Sauna A — Wood-fired', spots: 'Open', status: 'open' },
				{ time: '09:30', session: 'Plunge Deck', spots: 'Open', status: 'open' },
				{ time: '11:00', session: 'Quiet Room', spots: '2 left', status: 'few' },
				{ time: '13:00', session: 'Sauna B — Panorama', spots: 'Open', status: 'open' },
				{ time: '16:00', session: 'Plunge Deck', spots: 'Open', status: 'open' },
				{ time: '18:00', session: 'Sauna A — Wood-fired', spots: 'Full', status: 'full' }
			]
		}
	];

	const facilities: Facility[] = [
		{
			name: 'Sauna A',
			tag: 'Wood-fired · 90°C',
			desc: 'The original cabin. Spruce benches, a cast-iron stove, and the smell of birch smoke.',
			icon: 'flame'
		},
		{
			name: 'Sauna B',
			tag: 'Electric · Panorama',
			desc: 'Floor-to-ceiling glass facing the fjord. Gentler heat, longer view.',
			icon: 'flame'
		},
		{
			name: 'Plunge Deck',
			tag: 'Fjord water · 2–6°C',
			desc: 'Timber steps straight into open water. Depth-marked, current-checked, always supervised.',
			icon: 'snow'
		},
		{
			name: 'Quiet Room',
			tag: 'No talking, no phones',
			desc: 'Daybeds, wool blankets, and a self-serve pot of birch-leaf tea.',
			icon: 'leaf'
		}
	];

	const tiers: Tier[] = [
		{
			name: 'Drop-in',
			price: '145',
			period: 'per session',
			desc: 'One full hot–cold–rest cycle, any open slot.',
			features: ['1 sauna session', '1 plunge', '10 min quiet room', 'Towel included']
		},
		{
			name: 'Ten-Pack',
			price: '1,050',
			period: 'valid 6 months',
			desc: 'For the ones who come every week, not every season.',
			features: ['10 sessions, no expiry rush', 'Priority booking window', 'Guest pass ×1', 'Towel included'],
			featured: true
		},
		{
			name: 'Founding',
			price: '480',
			period: 'per month',
			desc: 'Unlimited access, and a hook with your name on it.',
			features: ['Unlimited sessions', 'Reserved locker', 'Guest pass ×2 monthly', 'First access to new hours']
		}
	];

	let selectedDay = 0;

	function statusLabel(s: Slot['status']): string {
		if (s === 'open') return 'is-open';
		if (s === 'few') return 'is-few';
		return 'is-full';
	}
</script>

<div class="flex min-h-screen flex-col kysten">
	<!-- NAV -->
	<header class="nav">
		<div class="nav-inner">
			<a href="#top" class="wordmark">Kysten<span class="wordmark-dot">.</span></a>
			<nav class="nav-links">
				<a href="#ritual">Sessions</a>
				<a href="#facilities">Facilities</a>
				<a href="#membership">Membership</a>
			</nav>
			<a href="#schedule" class="btn btn-primary btn-small">Book a session</a>
		</div>
	</header>

	<!-- HERO -->
	<section class="hero" id="top">
		<div class="hero-steam" aria-hidden="true">
			<span class="steam s1"></span>
			<span class="steam s2"></span>
			<span class="steam s3"></span>
		</div>
		<div class="hero-inner">
			<div class="hero-copy">
				<p class="eyebrow">Harbour bathhouse — open year-round</p>
				<h1>Hot.<br />Cold.<br />Quiet.</h1>
				<p class="hero-sub">
					Book a sauna, a fjord plunge, and ten minutes of silence. Real wood fires,
					real cold water, forty minutes to reset.
				</p>
				<div class="hero-actions">
					<a href="#schedule" class="btn btn-primary">Reserve a session</a>
					<a href="#schedule" class="btn btn-ghost">See today's schedule ↓</a>
				</div>
			</div>
			<div class="hero-gauge" aria-hidden="true">
				<svg viewBox="0 0 320 220" class="gauge-svg">
					<path d="M 30 190 A 130 130 0 0 1 290 190" fill="none" stroke="var(--moss)" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round" />
					<path d="M 30 190 A 130 130 0 0 1 160 60" fill="none" stroke="var(--tide)" stroke-width="10" stroke-linecap="round" />
					<path d="M 160 60 A 130 130 0 0 1 290 190" fill="none" stroke="var(--ember)" stroke-width="10" stroke-linecap="round" />
					<line x1="160" y1="190" x2="230" y2="95" stroke="var(--birch)" stroke-width="3" stroke-linecap="round" />
					<circle cx="160" cy="190" r="7" fill="var(--birch)" />
					<text x="34" y="212" class="gauge-label">4°C</text>
					<text x="255" y="212" class="gauge-label">90°C</text>
				</svg>
				<p class="gauge-caption">Today's range</p>
			</div>
		</div>
	</section>

	<!-- RITUAL -->
	<section class="ritual" id="ritual">
		<div class="section-head">
			<p class="eyebrow">The sequence</p>
			<h2>One cycle, three phases</h2>
		</div>
		<ol class="ritual-list">
			{#each ritual as step, i}
				<li class="ritual-step">
					<div class="ritual-meta">
						<span class="ritual-value">{step.value}</span>
						<span class="ritual-duration">{step.duration}</span>
					</div>
					<h3>{step.phase}</h3>
					<p>{step.desc}</p>
					{#if i < ritual.length - 1}
						<span class="ritual-arrow" aria-hidden="true">→</span>
					{/if}
				</li>
			{/each}
		</ol>
	</section>

	<!-- SCHEDULE / SPLIT-FLAP BOARD -->
	<section class="schedule" id="schedule">
		<div class="section-head">
			<p class="eyebrow">Departures, of a kind</p>
			<h2>Today's slots</h2>
		</div>

		<div class="day-tabs" role="tablist" aria-label="Choose a day">
			{#each schedule as day, i}
				<button
					role="tab"
					aria-selected={selectedDay === i}
					class="day-tab"
					class:active={selectedDay === i}
					on:click={() => (selectedDay = i)}
				>
					{day.label}
				</button>
			{/each}
		</div>

		<div class="board">
			<div class="board-header">
				<span>Time</span>
				<span>Session</span>
				<span>Spots</span>
			</div>
			{#key selectedDay}
				{#each schedule[selectedDay].slots as slot, i}
					<button class="board-row" style="animation-delay: {i * 70}ms">
						<span class="board-time">{slot.time}</span>
						<span class="board-session">{slot.session}</span>
						<span class="board-status {statusLabel(slot.status)}">{slot.spots}</span>
					</button>
				{/each}
			{/key}
		</div>
	</section>

	<!-- FACILITIES -->
	<section class="facilities" id="facilities">
		<div class="section-head">
			<p class="eyebrow">On site</p>
			<h2>Two saunas, one fjord, one silence</h2>
		</div>
		<div class="facility-grid">
			{#each facilities as f}
				<div class="facility-card">
					<div class="facility-icon">
						{#if f.icon === 'flame'}
							<svg viewBox="0 0 24 24" fill="none"><path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c1.5 1 2 3 2 4.5A5.5 5.5 0 0 1 11.5 21 6.5 6.5 0 0 1 5 14.5C5 10 8 8 8 4c1.5 1 2 2 2 3.5C10.5 5 12 3.5 12 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
						{:else if f.icon === 'snow'}
							<svg viewBox="0 0 24 24" fill="none"><path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
						{:else}
							<svg viewBox="0 0 24 24" fill="none"><path d="M4 20c8-1 12-6 12-14-8 1-12 6-12 14Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 16c2-3 4-5 8-8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
						{/if}
					</div>
					<h3>{f.name}</h3>
					<p class="facility-tag">{f.tag}</p>
					<p class="facility-desc">{f.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- QUOTE STRIP -->
	<section class="quote">
		<p>&ldquo;I stopped counting minutes and started counting temperatures instead.&rdquo;</p>
		<span>— A regular, Wednesday 07:00 slot</span>
	</section>

	<!-- MEMBERSHIP -->
	<section class="membership" id="membership">
		<div class="section-head">
			<p class="eyebrow">Come back</p>
			<h2>Pick how often</h2>
		</div>
		<div class="tier-grid">
			{#each tiers as tier}
				<div class="tier-card" class:featured={tier.featured}>
					{#if tier.featured}<span class="tier-badge">Most booked</span>{/if}
					<h3>{tier.name}</h3>
					<p class="tier-desc">{tier.desc}</p>
					<p class="tier-price"><span>{tier.price}</span> DKK <small>{tier.period}</small></p>
					<ul>
						{#each tier.features as feat}
							<li>{feat}</li>
						{/each}
					</ul>
					<a href="#schedule" class="btn {tier.featured ? 'btn-primary' : 'btn-ghost'} btn-full">Choose {tier.name}</a>
				</div>
			{/each}
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="footer">
		<div class="footer-top">
			<span class="wordmark">Kysten<span class="wordmark-dot">.</span></span>
			<a href="#schedule" class="btn btn-primary btn-small">Reserve a session</a>
		</div>
		<div class="footer-grid">
			<div>
				<h4>Hours</h4>
				<p>Mon–Fri 07:00–21:00</p>
				<p>Sat–Sun 08:00–19:00</p>
			</div>
			<div>
				<h4>Find us</h4>
				<p>Havnepromenaden 12</p>
				<p>8700 Horsens, Denmark</p>
			</div>
			<div>
				<h4>Before you plunge</h4>
				<p>Arrive 10 min early. No swimwear required in the sauna cabins.</p>
			</div>
		</div>
		<p class="footer-legal">© {new Date().getFullYear()} Kysten Badehus. Cold water, warm welcome.</p>
	</footer>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

	.kysten {
		--ink: #14201c;
		--ink-soft: #1c2b25;
		--birch: #f2ede1;
		--birch-dim: #cfc9bb;
		--ember: #c1602e;
		--ember-soft: #7a3d20;
		--tide: #2e625c;
		--tide-soft: #1f4642;
		--moss: #6b7a63;
		--brass: #a88a5b;

		--display: 'Fraunces', serif;
		--body: 'Inter', sans-serif;
		--mono: 'IBM Plex Mono', monospace;

		background: var(--ink);
		color: var(--birch);
		font-family: var(--body);
		line-height: 1.5;
	}

	.kysten :global(*) {
		box-sizing: border-box;
	}

	.kysten a {
		color: inherit;
		text-decoration: none;
	}

	.kysten h1,
	.kysten h2,
	.kysten h3 {
		font-family: var(--display);
		font-weight: 500;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.kysten :focus-visible {
		outline: 2px solid var(--brass);
		outline-offset: 3px;
	}

	.eyebrow {
		font-family: var(--mono);
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--brass);
		margin: 0 0 0.6rem;
	}

	.section-head {
		max-width: 640px;
		margin: 0 auto 2.5rem;
		text-align: center;
	}

	.section-head h2 {
		font-size: clamp(1.6rem, 3vw, 2.2rem);
	}

	/* BUTTONS */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.85rem 1.5rem;
		border-radius: 999px;
		font-size: 0.92rem;
		font-weight: 500;
		border: 1px solid transparent;
		transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
		cursor: pointer;
	}
	.btn:hover {
		transform: translateY(-1px);
	}
	.btn-primary {
		background: var(--ember);
		color: var(--birch);
	}
	.btn-primary:hover {
		background: #d1712f;
	}
	.btn-ghost {
		background: transparent;
		border-color: rgba(242, 237, 225, 0.25);
		color: var(--birch);
	}
	.btn-ghost:hover {
		border-color: var(--brass);
	}
	.btn-small {
		padding: 0.6rem 1.2rem;
		font-size: 0.85rem;
	}
	.btn-full {
		width: 100%;
	}

	/* NAV */
	.nav {
		position: sticky;
		top: 0;
		z-index: 20;
		background: rgba(20, 32, 28, 0.85);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid rgba(242, 237, 225, 0.08);
	}
	.nav-inner {
		max-width: 1180px;
		margin: 0 auto;
		padding: 1.1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.wordmark {
		font-family: var(--display);
		font-size: 1.3rem;
		letter-spacing: 0.01em;
	}
	.wordmark-dot {
		color: var(--ember);
	}
	.nav-links {
		display: flex;
		gap: 2rem;
		font-size: 0.92rem;
	}
	.nav-links a {
		opacity: 0.85;
	}
	.nav-links a:hover {
		opacity: 1;
	}

	/* HERO */
	.hero {
		position: relative;
		overflow: hidden;
		padding: 4.5rem 1.5rem 5rem;
		border-bottom: 1px solid rgba(242, 237, 225, 0.08);
	}
	.hero-steam {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.35;
	}
	.steam {
		position: absolute;
		width: 340px;
		height: 340px;
		border-radius: 50%;
		filter: blur(70px);
	}
	.s1 {
		background: var(--tide);
		top: -120px;
		left: -80px;
		animation: drift 18s ease-in-out infinite;
	}
	.s2 {
		background: var(--ember-soft);
		bottom: -140px;
		right: -60px;
		animation: drift 22s ease-in-out infinite reverse;
	}
	.s3 {
		background: var(--moss);
		top: 30%;
		right: 20%;
		width: 220px;
		height: 220px;
		animation: drift 26s ease-in-out infinite;
	}
	@keyframes drift {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(30px, -20px); }
	}
	.hero-inner {
		position: relative;
		max-width: 1180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 3rem;
		align-items: center;
	}
	.hero-copy h1 {
		font-size: clamp(3rem, 7vw, 5.2rem);
		line-height: 0.98;
		margin: 0.4rem 0 1.4rem;
	}
	.hero-sub {
		max-width: 46ch;
		color: var(--birch-dim);
		font-size: 1.05rem;
	}
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}
	.hero-gauge {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}
	.gauge-svg {
		width: 100%;
		max-width: 320px;
	}
	.gauge-label {
		font-family: var(--mono);
		font-size: 13px;
		fill: var(--birch-dim);
	}
	.gauge-caption {
		font-family: var(--mono);
		font-size: 0.78rem;
		color: var(--brass);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	/* RITUAL */
	.ritual {
		padding: 5rem 1.5rem;
		border-bottom: 1px solid rgba(242, 237, 225, 0.08);
	}
	.ritual-list {
		list-style: none;
		margin: 0 auto;
		padding: 0;
		max-width: 1100px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
	}
	.ritual-step {
		position: relative;
		background: var(--ink-soft);
		border: 1px solid rgba(242, 237, 225, 0.08);
		border-radius: 14px;
		padding: 1.8rem;
	}
	.ritual-meta {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin-bottom: 0.9rem;
	}
	.ritual-value {
		font-family: var(--mono);
		font-size: 1.5rem;
		color: var(--ember);
	}
	.ritual-step:nth-child(2) .ritual-value {
		color: var(--tide);
	}
	.ritual-duration {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--brass);
	}
	.ritual-step h3 {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}
	.ritual-step p {
		color: var(--birch-dim);
		font-size: 0.94rem;
		margin: 0;
	}
	.ritual-arrow {
		position: absolute;
		right: -1.7rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--moss);
		font-size: 1.2rem;
	}

	/* SCHEDULE / BOARD */
	.schedule {
		padding: 5rem 1.5rem;
		border-bottom: 1px solid rgba(242, 237, 225, 0.08);
	}
	.day-tabs {
		display: flex;
		justify-content: center;
		gap: 0.6rem;
		margin-bottom: 1.6rem;
	}
	.day-tab {
		font-family: var(--mono);
		font-size: 0.82rem;
		padding: 0.5rem 1.1rem;
		border-radius: 999px;
		border: 1px solid rgba(242, 237, 225, 0.15);
		background: transparent;
		color: var(--birch-dim);
		cursor: pointer;
	}
	.day-tab.active {
		background: var(--birch);
		color: var(--ink);
		border-color: var(--birch);
	}
	.board {
		max-width: 720px;
		margin: 0 auto;
		background: var(--ink-soft);
		border: 1px solid rgba(242, 237, 225, 0.1);
		border-radius: 16px;
		overflow: hidden;
	}
	.board-header {
		display: grid;
		grid-template-columns: 90px 1fr 110px;
		padding: 0.9rem 1.5rem;
		font-family: var(--mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--brass);
		border-bottom: 1px solid rgba(242, 237, 225, 0.1);
	}
	.board-row {
		width: 100%;
		display: grid;
		grid-template-columns: 90px 1fr 110px;
		align-items: center;
		padding: 1rem 1.5rem;
		background: transparent;
		border: none;
		border-bottom: 1px solid rgba(242, 237, 225, 0.06);
		color: var(--birch);
		text-align: left;
		cursor: pointer;
		transform-origin: top center;
		animation: flap 0.4s ease both;
	}
	.board-row:last-child {
		border-bottom: none;
	}
	.board-row:hover {
		background: rgba(242, 237, 225, 0.04);
	}
	.board-time {
		font-family: var(--mono);
		font-size: 0.95rem;
		color: var(--birch);
	}
	.board-session {
		font-size: 0.95rem;
	}
	.board-status {
		font-family: var(--mono);
		font-size: 0.8rem;
		justify-self: start;
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
	}
	.is-open {
		background: rgba(107, 122, 99, 0.25);
		color: #b7c4ae;
	}
	.is-few {
		background: rgba(193, 96, 46, 0.22);
		color: #e5a479;
	}
	.is-full {
		background: rgba(242, 237, 225, 0.08);
		color: var(--birch-dim);
	}
	@keyframes flap {
		from {
			opacity: 0;
			transform: rotateX(-90deg);
		}
		to {
			opacity: 1;
			transform: rotateX(0deg);
		}
	}

	/* FACILITIES */
	.facilities {
		padding: 5rem 1.5rem;
		border-bottom: 1px solid rgba(242, 237, 225, 0.08);
	}
	.facility-grid {
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
	}
	.facility-card {
		border: 1px solid rgba(242, 237, 225, 0.1);
		border-radius: 14px;
		padding: 1.6rem;
	}
	.facility-icon {
		width: 34px;
		height: 34px;
		color: var(--ember);
		margin-bottom: 1rem;
	}
	.facility-card:nth-child(3) .facility-icon {
		color: var(--tide);
	}
	.facility-card:nth-child(4) .facility-icon {
		color: var(--moss);
	}
	.facility-icon svg {
		width: 100%;
		height: 100%;
	}
	.facility-card h3 {
		font-size: 1.1rem;
		margin-bottom: 0.3rem;
	}
	.facility-tag {
		font-family: var(--mono);
		font-size: 0.76rem;
		color: var(--brass);
		margin: 0 0 0.7rem;
	}
	.facility-desc {
		font-size: 0.9rem;
		color: var(--birch-dim);
		margin: 0;
	}

	/* QUOTE */
	.quote {
		padding: 4rem 1.5rem;
		text-align: center;
		border-bottom: 1px solid rgba(242, 237, 225, 0.08);
	}
	.quote p {
		font-family: var(--display);
		font-size: clamp(1.3rem, 2.4vw, 1.8rem);
		max-width: 720px;
		margin: 0 auto 0.8rem;
		font-style: italic;
	}
	.quote span {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--brass);
	}

	/* MEMBERSHIP */
	.membership {
		padding: 5rem 1.5rem;
		border-bottom: 1px solid rgba(242, 237, 225, 0.08);
	}
	.tier-grid {
		max-width: 1000px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}
	.tier-card {
		position: relative;
		border: 1px solid rgba(242, 237, 225, 0.1);
		border-radius: 16px;
		padding: 2rem 1.7rem;
		display: flex;
		flex-direction: column;
	}
	.tier-card.featured {
		background: var(--ink-soft);
		border-color: var(--ember);
	}
	.tier-badge {
		position: absolute;
		top: -0.7rem;
		left: 1.7rem;
		background: var(--ember);
		color: var(--birch);
		font-family: var(--mono);
		font-size: 0.7rem;
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
	}
	.tier-desc {
		color: var(--birch-dim);
		font-size: 0.88rem;
		margin: 0.4rem 0 1.2rem;
	}
	.tier-price {
		font-family: var(--display);
		font-size: 2.1rem;
		margin: 0 0 1.4rem;
	}
	.tier-price small {
		font-family: var(--mono);
		font-size: 0.7rem;
		color: var(--birch-dim);
		display: block;
		margin-top: 0.3rem;
	}
	.tier-card ul {
		list-style: none;
		padding: 0;
		margin: 0 0 1.8rem;
		flex: 1;
	}
	.tier-card li {
		font-size: 0.88rem;
		color: var(--birch-dim);
		padding: 0.4rem 0;
		border-top: 1px solid rgba(242, 237, 225, 0.08);
	}
	.tier-card li:first-child {
		border-top: none;
	}

	/* FOOTER */
	.footer {
		margin-top: auto;
		padding: 3rem 1.5rem 2rem;
	}
	.footer-top {
		max-width: 1180px;
		margin: 0 auto 2.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.footer-grid {
		max-width: 1180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(242, 237, 225, 0.08);
	}
	.footer-grid h4 {
		font-family: var(--mono);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--brass);
		margin: 0 0 0.6rem;
	}
	.footer-grid p {
		font-size: 0.88rem;
		color: var(--birch-dim);
		margin: 0.2rem 0;
	}
	.footer-legal {
		max-width: 1180px;
		margin: 1.5rem auto 0;
		font-size: 0.78rem;
		color: var(--moss);
	}

	@media (prefers-reduced-motion: reduce) {
		.steam,
		.board-row {
			animation: none !important;
		}
	}

	@media (max-width: 900px) {
		.hero-inner {
			grid-template-columns: 1fr;
		}
		.ritual-list,
		.tier-grid {
			grid-template-columns: 1fr;
		}
		.ritual-arrow {
			display: none;
		}
		.facility-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.nav-links {
			display: none;
		}
		.facility-grid {
			grid-template-columns: 1fr;
		}
		.board-header,
		.board-row {
			grid-template-columns: 70px 1fr 80px;
			padding: 0.9rem 1rem;
		}
	}
</style>