<script>
	import { onMount } from 'svelte';
	import PortfolioShell from '$lib/components/PortfolioShell.svelte';
	import { workTimeline } from '$lib/data/portfolio.js';

	let active = $state(0);
	let current = $derived(workTimeline[active]);

	onMount(() => {
		const onKey = (event) => {
			if (event.key === 'ArrowUp') active = Math.max(0, active - 1);
			if (event.key === 'ArrowDown') active = Math.min(workTimeline.length - 1, active + 1);
		};

		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<PortfolioShell section="WORK" pageCode="04" kicker="EXPERIENCE // TIMELINE">
	<section class="work-layout">
		<div class="work-lead">
			<p class="work-overline">CAREER RECORD</p>
			<h1>WORK<br /><span>LOG</span></h1>
			<p class="work-summary">
				A transparent record of where I am now, what I am building, and the kind of team I want to
				join next.
			</p>
			<a class="availability" href="https://github.com/PhamHao21" target="_blank" rel="noreferrer">
				<i></i><span>VIEW GITHUB PROFILE</span><strong>+</strong>
			</a>
		</div>

		<div class="timeline" aria-label="Work timeline">
			<div class="timeline-line"></div>
			{#each workTimeline as item, index}
				<button
					type="button"
					class:active={active === index}
					style={`--item-delay: ${160 + index * 75}ms`}
					onclick={() => (active = index)}
					onmouseenter={() => (active = index)}
					onfocus={() => (active = index)}
				>
					<span class="timeline-node"></span>
					<span class="timeline-code">{item.code}</span>
					<span class="timeline-copy">
						<small>{item.period}</small>
						<strong>{item.role}</strong>
						<em>{item.organization}</em>
					</span>
				</button>
			{/each}
		</div>

		{#key active}
			<article class="work-card">
				<header>
					<div>
						<span>SELECTED RECORD</span>
						<h2>{current.code}</h2>
					</div>
					<strong>{current.status}</strong>
				</header>

				<div class="record-title">
					<small>{current.period}</small>
					<h3>{current.role}</h3>
					<p>{current.organization}</p>
				</div>

				<p class="record-description">{current.description}</p>

				<div class="focus-list">
					<span>PRIMARY FOCUS</span>
					{#each current.focus as focus, index}
						<div style={`--delay: ${index * 70}ms`}>
							<small>{String(index + 1).padStart(2, '0')}</small>
							<strong>{focus}</strong>
						</div>
					{/each}
				</div>
			</article>
		{/key}
	</section>
</PortfolioShell>

<style>
	.work-layout {
		min-height: 100%;
		display: grid;
		grid-template-columns: minmax(280px, 0.68fr) minmax(360px, 0.88fr) minmax(430px, 1fr);
		gap: clamp(28px, 3.5vw, 66px);
		align-items: center;
		padding: 105px 5vw 70px 7vw;
	}

	.work-lead { animation: lead-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.06s both; }
	.work-overline { margin-bottom: 10px; color: #6af0ff; font-size: 12px; font-weight: 700; letter-spacing: 4px; }
	h1 { font-family: 'Anton', sans-serif; font-size: clamp(76px, 8vw, 128px); font-style: italic; font-weight: 400; letter-spacing: -3px; line-height: 0.76; color: #f8fcff; text-shadow: 9px 7px 0 rgba(8, 54, 157, 0.8); }
	h1 span { color: #65efff; }
	.work-summary { max-width: 440px; margin-top: 28px; padding-left: 17px; border-left: 4px solid #ff4669; color: rgba(230, 248, 255, 0.72); font-size: 19px; line-height: 1.42; }

	.availability { display: flex; align-items: center; width: fit-content; gap: 11px; margin-top: 26px; padding: 11px 16px 10px; color: #061039; background: #f8fcff; font-size: 12px; font-weight: 800; letter-spacing: 1.7px; text-decoration: none; transform: skewX(-7deg); box-shadow: 7px 6px 0 #ff4669; transition: transform 0.2s ease, box-shadow 0.2s ease; }
	.availability:hover { transform: skewX(-7deg) translate(-3px, -3px); box-shadow: 11px 10px 0 #ff4669; }
	.availability i { width: 8px; height: 8px; border-radius: 50%; background: #14b66b; box-shadow: 0 0 0 4px rgba(20, 182, 107, 0.18); animation: status-pulse 1.8s ease-in-out infinite; }
	.availability strong { color: #ff4669; font-size: 20px; line-height: 0.5; }

	.timeline { position: relative; display: flex; flex-direction: column; gap: 13px; padding-left: 18px; }
	.timeline-line { position: absolute; top: 34px; bottom: 34px; left: 25px; width: 2px; background: linear-gradient(#69efff, rgba(105, 239, 255, 0.08)); }
	.timeline button { position: relative; display: grid; grid-template-columns: 28px 65px 1fr; align-items: center; gap: 12px; min-height: 112px; padding: 15px 17px 15px 0; overflow: hidden; border: 1px solid rgba(112, 232, 255, 0.14); background: rgba(3, 11, 46, 0.65); color: #eafaff; text-align: left; clip-path: polygon(0 0, 96% 0, 100% 100%, 3% 100%); cursor: pointer; transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), background 0.24s ease; animation: timeline-enter 0.58s cubic-bezier(0.16, 1, 0.3, 1) var(--item-delay) backwards; }
	.timeline button::after { content: ''; position: absolute; inset: 0 auto 0 -50%; width: 28%; background: linear-gradient(90deg, transparent, rgba(104, 239, 255, 0.26), transparent); transform: skewX(-18deg); transition: left 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
	.timeline button:hover::after, .timeline button.active::after { left: 120%; }
	.timeline button > span { position: relative; z-index: 1; }
	.timeline button:hover { transform: translateX(6px); background: rgba(9, 33, 102, 0.86); }
	.timeline button.active { color: #06113a; background: #f7fbff; transform: translateX(13px); box-shadow: -8px 7px 0 #ff4669; }
	.timeline-node { position: relative; z-index: 2; justify-self: center; width: 15px; height: 15px; border: 3px solid #07144a; border-radius: 50%; background: #68efff; box-shadow: 0 0 0 3px #68efff; }
	.active .timeline-node { border-color: #fff; background: #ff4669; box-shadow: 0 0 0 3px #ff4669; }
	.timeline-code { font-family: 'Anton', sans-serif; font-size: 31px; font-style: italic; color: #64edff; }
	.active .timeline-code { color: #ff4669; }
	.timeline-copy small, .timeline-copy strong, .timeline-copy em { display: block; }
	.timeline-copy small { margin-bottom: 5px; color: rgba(126, 231, 255, 0.55); font-size: 9px; font-weight: 700; letter-spacing: 2px; }
	.timeline-copy strong { font-family: 'Anton', sans-serif; font-size: 22px; font-weight: 400; letter-spacing: 0.5px; line-height: 1.05; }
	.timeline-copy em { margin-top: 5px; color: rgba(183, 230, 245, 0.53); font-size: 11px; font-style: normal; font-weight: 700; letter-spacing: 1.3px; }
	.active .timeline-copy small, .active .timeline-copy em { color: rgba(6, 17, 58, 0.55); }

	.work-card { position: relative; padding: 30px 32px 34px; background: rgba(3, 10, 40, 0.9); border-top: 4px solid #64efff; clip-path: polygon(0 0, 100% 0, calc(100% - 34px) 100%, 0 100%); box-shadow: 18px 17px 0 rgba(0, 3, 20, 0.45); backdrop-filter: blur(13px); animation: card-in 0.48s cubic-bezier(0.16, 1, 0.3, 1) both; }
	.work-card header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid rgba(111, 235, 255, 0.16); }
	.work-card header span { color: rgba(135, 234, 255, 0.5); font-size: 10px; font-weight: 700; letter-spacing: 3px; }
	.work-card header h2 { margin-top: 4px; font-family: 'Anton', sans-serif; font-size: 70px; font-style: italic; font-weight: 400; line-height: 0.85; color: #fff; }
	.work-card header > strong { padding: 7px 11px 5px; color: #07113d; background: #64efff; font-size: 10px; letter-spacing: 1.5px; transform: skewX(-9deg); }
	.record-title { margin-top: 26px; }
	.record-title small { color: #ff5877; font-size: 10px; font-weight: 800; letter-spacing: 3px; }
	.record-title h3 { max-width: 620px; margin-top: 5px; font-family: 'Anton', sans-serif; font-size: clamp(38px, 3.8vw, 61px); font-weight: 400; line-height: 0.94; }
	.record-title p { margin-top: 8px; color: #65edff; font-size: 14px; font-weight: 700; letter-spacing: 2px; }
	.record-description { margin-top: 22px; color: rgba(229, 247, 255, 0.7); font-size: 18px; line-height: 1.45; }
	.focus-list { margin-top: 28px; }
	.focus-list > span { color: rgba(135, 234, 255, 0.45); font-size: 9px; font-weight: 700; letter-spacing: 3px; }
	.focus-list > div { display: grid; grid-template-columns: 35px 1fr; align-items: center; gap: 11px; padding: 11px 0; border-bottom: 1px solid rgba(111, 235, 255, 0.12); animation: focus-in 0.42s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) both; }
	.focus-list small { color: #ff5273; font-family: 'Anton', sans-serif; font-size: 18px; font-style: italic; }
	.focus-list strong { font-size: 16px; letter-spacing: 1px; text-transform: uppercase; }

	@keyframes card-in { from { opacity: 0; transform: translateX(42px); } to { opacity: 1; transform: translateX(0); } }
	@keyframes focus-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
	@keyframes status-pulse { 50% { transform: scale(0.72); opacity: 0.65; } }
	@keyframes lead-enter { from { opacity: 0; transform: translate3d(-30px, 12px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
	@keyframes timeline-enter { from { opacity: 0; transform: translate3d(30px, 14px, 0) skewX(-2deg); } to { opacity: 1; transform: translate3d(0, 0, 0) skewX(0); } }

	@media (max-width: 1100px) {
		.work-layout { grid-template-columns: 0.78fr 1fr; padding-top: 135px; }
		.work-lead { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; align-items: end; }
		.work-summary { grid-column: 2; grid-row: 1 / span 2; }
		.availability { display: none; }
	}

	@media (max-width: 800px) {
		.work-layout { grid-template-columns: 1fr; padding: 155px 20px 95px; }
		.work-lead { display: block; }
		h1 { font-size: clamp(68px, 23vw, 98px); }
		.timeline { padding-right: 8px; }
		.timeline button { min-height: 100px; grid-template-columns: 28px 54px 1fr; }
		.work-card { min-height: 480px; }
	}

	@media (prefers-reduced-motion: reduce) {
		.work-lead, .timeline button, .work-card, .focus-list > div, .availability i { animation: none; }
	}
</style>
