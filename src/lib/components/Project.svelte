<script>
	import { onMount } from 'svelte';
	import PortfolioShell from '$lib/components/PortfolioShell.svelte';
	import { portfolioProjects } from '$lib/data/portfolio.js';

	let active = $state(0);
	let current = $derived(portfolioProjects[active]);

	function openCurrent() {
		if (current.href) window.open(current.href, '_blank', 'noopener,noreferrer');
	}

	onMount(() => {
		const onKey = (event) => {
			if (event.key === 'ArrowUp') active = Math.max(0, active - 1);
			if (event.key === 'ArrowDown') active = Math.min(portfolioProjects.length - 1, active + 1);
			if (event.key === 'Enter') openCurrent();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<PortfolioShell section="PROJECTS" pageCode="02" kicker="CASE FILE // SELECT">
	<section class="project-layout">
		<div class="project-heading">
			<p>CASE STUDY ARCHIVE</p>
			<h1>SELECT<br /><span>A PROJECT</span></h1>
			<div class="project-progress">
				<strong>{String(active + 1).padStart(2, '0')}</strong>
				<i></i>
				<span>{String(portfolioProjects.length).padStart(2, '0')}</span>
			</div>
		</div>

		<div class="project-list">
			{#each portfolioProjects as project, index}
				<button
					type="button"
					class:active={active === index}
					style={`--item-delay: ${160 + index * 70}ms`}
					onclick={() => (active = index)}
					onmouseenter={() => (active = index)}
					onfocus={() => (active = index)}
				>
					<span class="project-code">{project.code}</span>
					<span class="project-list-copy"><strong>{project.title}</strong><small>{project.category}</small></span>
					<span class="project-state">{project.status}</span>
				</button>
			{/each}
		</div>

		{#key active}
			<article class="project-case">
				<div class="case-ghost-number">{String(active + 1).padStart(2, '0')}</div>
				<div class="case-topline">
					<span>{current.category}</span>
					<strong>{current.year}</strong>
				</div>
				<h2>{current.title}</h2>
				<p class="case-description">{current.description}</p>

				<div class="case-facts">
					<div><span>CHALLENGE</span><p>{current.challenge}</p></div>
					<div><span>RESULT</span><p>{current.result}</p></div>
				</div>

				<div class="case-footer">
					<div class="case-tags">
						{#each current.tags as tag}<span>{tag}</span>{/each}
					</div>
					{#if current.href}
						<a href={current.href} target="_blank" rel="noreferrer">VIEW SOURCE <strong>↗</strong></a>
					{:else}
						<div class="case-locked">FILE LOCKED</div>
					{/if}
				</div>
			</article>
		{/key}
	</section>
</PortfolioShell>

<style>
	.project-layout { min-height: 100%; display: grid; grid-template-columns: minmax(260px, 0.55fr) minmax(340px, 0.72fr) minmax(480px, 1.15fr); gap: clamp(22px, 3vw, 52px); align-items: center; padding: 104px 5vw 72px 7vw; }
	.project-heading { animation: heading-enter 0.68s cubic-bezier(0.16, 1, 0.3, 1) 0.06s both; }
	.project-heading > p { margin-bottom: 10px; color: #69efff; font-size: 11px; font-weight: 700; letter-spacing: 4px; }
	h1 { font-family: 'Anton', sans-serif; font-size: clamp(66px, 6.8vw, 112px); font-style: italic; font-weight: 400; letter-spacing: -3px; line-height: 0.8; color: #fff; text-shadow: 8px 7px 0 rgba(5, 60, 170, 0.78); }
	h1 span { color: #64efff; }
	.project-progress { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; width: min(270px, 100%); margin-top: 28px; }
	.project-progress strong { font-family: 'Anton', sans-serif; font-size: 38px; font-style: italic; color: #ff4b6d; }
	.project-progress i { height: 2px; background: linear-gradient(90deg, #ff4b6d, rgba(102, 239, 255, 0.25)); }
	.project-progress span { color: rgba(183, 235, 255, 0.55); font-size: 15px; font-weight: 700; }

	.project-list { display: flex; flex-direction: column; gap: 10px; }
	.project-list button { position: relative; display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 12px; width: 100%; min-height: 86px; padding: 12px 17px; overflow: hidden; border: 1px solid rgba(114, 234, 255, 0.14); color: rgba(231, 249, 255, 0.68); background: rgba(3, 10, 40, 0.72); text-align: left; clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%); cursor: pointer; transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), background 0.24s ease; animation: list-enter 0.58s cubic-bezier(0.16, 1, 0.3, 1) var(--item-delay) backwards; }
	.project-list button::after { content: ''; position: absolute; top: 0; bottom: 0; left: -55%; width: 30%; background: linear-gradient(90deg, transparent, rgba(105, 239, 255, 0.26), transparent); transform: skewX(-18deg); transition: left 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
	.project-list button:hover::after, .project-list button.active::after { left: 120%; }
	.project-list button > span { position: relative; z-index: 1; }
	.project-list button:hover { transform: translateX(5px); background: rgba(9, 32, 98, 0.86); }
	.project-list button.active { color: #06113a; background: #f7fbff; transform: translateX(14px); box-shadow: -10px 7px 0 #ff4265; }
	.project-code { font-family: 'Anton', sans-serif; font-size: 23px; font-style: italic; color: #63efff; }
	.active .project-code { color: #ff4265; }
	.project-list-copy { min-width: 0; }
	.project-list-copy strong, .project-list-copy small { display: block; }
	.project-list-copy strong { overflow: hidden; font-family: 'Anton', sans-serif; font-size: 24px; font-weight: 400; line-height: 1; text-overflow: ellipsis; white-space: nowrap; }
	.project-list-copy small { margin-top: 6px; color: rgba(154, 225, 249, 0.46); font-size: 10px; font-weight: 700; letter-spacing: 1.3px; }
	.active .project-list-copy small { color: rgba(5, 17, 58, 0.52); }
	.project-state { padding: 5px 7px; border: 1px solid currentColor; color: #6aefff; font-size: 9px; font-weight: 700; letter-spacing: 1px; }
	.active .project-state { color: #0b49c4; }

	.project-case { position: relative; min-height: 530px; padding: 34px 34px 30px; overflow: hidden; background: rgba(3, 9, 36, 0.9); border-top: 4px solid #61efff; clip-path: polygon(0 0, 100% 0, calc(100% - 38px) 100%, 0 100%); box-shadow: 20px 18px 0 rgba(0, 3, 18, 0.46); backdrop-filter: blur(15px); animation: case-in 0.48s cubic-bezier(0.16, 1, 0.3, 1) both; }
	.project-case::after { content: ''; position: absolute; right: -8%; bottom: -16%; width: 52%; aspect-ratio: 1; border: 36px solid rgba(90, 236, 255, 0.045); border-radius: 50%; pointer-events: none; }
	.case-ghost-number { position: absolute; right: 12px; top: -24px; color: rgba(106, 239, 255, 0.065); font-family: 'Anton', sans-serif; font-size: 210px; font-style: italic; line-height: 1; pointer-events: none; }
	.case-topline { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
	.case-topline span { color: #68efff; font-size: 11px; font-weight: 700; letter-spacing: 3px; }
	.case-topline strong { padding: 5px 9px; color: #06113a; background: #f7fbff; font-size: 13px; letter-spacing: 2px; transform: skewX(-9deg); }
	h2 { position: relative; z-index: 2; max-width: 650px; margin-top: 22px; font-family: 'Anton', sans-serif; font-size: clamp(52px, 5vw, 84px); font-weight: 400; line-height: 0.88; color: #fff; }
	.case-description { position: relative; z-index: 2; max-width: 680px; margin-top: 20px; padding-left: 16px; border-left: 4px solid #ff4669; color: rgba(232, 248, 255, 0.74); font-size: 19px; line-height: 1.42; }
	.case-facts { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 13px; margin-top: 29px; }
	.case-facts > div { min-height: 128px; padding: 16px 17px; background: rgba(20, 66, 145, 0.19); border-top: 1px solid rgba(103, 238, 255, 0.28); }
	.case-facts span { color: #68efff; font-size: 10px; font-weight: 700; letter-spacing: 2.5px; }
	.case-facts p { margin-top: 10px; color: rgba(232, 247, 255, 0.69); font-size: 15px; line-height: 1.35; }
	.case-footer { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-top: 28px; }
	.case-tags { display: flex; flex-wrap: wrap; gap: 6px; }
	.case-tags span { padding: 6px 9px; background: rgba(104, 239, 255, 0.1); color: #93f6ff; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; }
	.case-footer a, .case-locked { padding: 11px 15px; font-size: 13px; font-weight: 700; letter-spacing: 2px; }
	.case-footer a { color: #06113a; background: #f7fbff; text-decoration: none; transform: skewX(-8deg); transition: background 0.18s ease, transform 0.18s ease; }
	.case-footer a:hover { background: #64efff; transform: skewX(-8deg) translateX(5px); }
	.case-footer a strong { display: inline-block; margin-left: 10px; }
	.case-locked { color: rgba(170, 223, 241, 0.4); border: 1px solid rgba(150, 222, 245, 0.15); }

	@keyframes case-in { from { opacity: 0; transform: translateX(44px); } to { opacity: 1; transform: translateX(0); } }
	@keyframes heading-enter { from { opacity: 0; transform: translate3d(-30px, 12px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
	@keyframes list-enter { from { opacity: 0; transform: translate3d(30px, 14px, 0) skewX(-2deg); } to { opacity: 1; transform: translate3d(0, 0, 0) skewX(0); } }

	@media (max-width: 1150px) {
		.project-layout { grid-template-columns: 0.7fr 1fr; padding-top: 125px; }
		.project-heading { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr auto; align-items: end; }
		.project-progress { grid-column: 2; grid-row: 1 / span 2; }
	}

	@media (max-width: 800px) {
		.project-layout { grid-template-columns: 1fr; padding: 155px 20px 90px; }
		.project-heading { display: block; }
		h1 { font-size: clamp(60px, 21vw, 94px); }
		.project-list { flex-direction: row; overflow-x: auto; padding: 8px 8px 14px; scroll-snap-type: x mandatory; }
		.project-list button { min-width: min(330px, calc(100vw - 58px)); scroll-snap-align: start; }
		.project-list button.active { transform: translateX(3px); }
		.project-case { min-height: 600px; }
		h2 { font-size: clamp(48px, 16vw, 64px); }
		.case-facts { grid-template-columns: 1fr; }
		.case-footer { align-items: flex-start; flex-direction: column; }
	}

	@media (prefers-reduced-motion: reduce) { .project-heading, .project-list button, .project-case { animation: none; } }
</style>
