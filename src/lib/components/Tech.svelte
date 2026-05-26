<script>
	import { onMount } from 'svelte';
	import bgVideo from '$lib/assets/water-main-menu2.webm?url';
	import { educationRows, resumeItems } from '$lib/data/tech.js';

	let active = $state(1);
	let mounted = $state(false);

	onMount(() => {
		const timer = window.setTimeout(() => {
			mounted = true;
		}, 80);

		return () => {
			window.clearTimeout(timer);
		};
	});
</script>

<div id="menu-screen">
	<video src={bgVideo} autoplay loop muted playsinline></video>
	<div class="resume-entry-mask" aria-hidden="true">
		<video class="resume-entry-video" src={bgVideo} autoplay loop muted playsinline></video>
	</div>

	<div class="resume-overlay">
		<div class="resume-stack">
			<div class:mounted class="resume-list-tag">LIST</div>

			{#each resumeItems as item, index}
				<button
					type="button"
					class:active={active === index}
					class:mounted
					class="resume-card-wrap"
					style:transition-delay={`${index * 55}ms`}
					onmouseenter={() => {
						active = index;
					}}
					onclick={() => {
						active = index;
					}}
				>
					<div class="resume-card">
						<div class="resume-badge">
							<div class="resume-badge-text">{item.badge}</div>
						</div>
						<div class="resume-card-inner">
							<div class="resume-title">{item.title}</div>
							<div class="resume-rank">
								<div class="resume-rank-label">RANK</div>
								<div class="resume-rank-number">{item.rank}</div>
							</div>
						</div>
						<div class="resume-subtitle-bar">
							<div class="resume-subtitle">{item.subtitle}</div>
						</div>
					</div>
				</button>
			{/each}
		</div>

		{#if active === 0}
			<div class="resume-detail-panel">
				<div class="resume-detail-top">
					<div class="resume-detail-top-index">01</div>
					<div class="resume-detail-top-title">EDUCATION LOG</div>
					<div class="resume-detail-top-progress">7/5</div>
				</div>

				<div class="resume-detail-list">
					{#each educationRows as row}
						<div class="resume-detail-row">
							<div class="resume-detail-row-index">{row.index}</div>
							<div class="resume-detail-row-title">{row.title}</div>
							<div class="resume-detail-status">{row.status}</div>
						</div>
					{/each}
				</div>

				<div class="resume-detail-bottom">
					<div class="resume-detail-bottom-title">DETAILS</div>
					<div class="resume-detail-bullets">
						<div class="resume-detail-bullet">- Maintain progress across required classes and supporting work.</div>
						<div class="resume-detail-bullet">- Track portfolio-ready projects tied to coursework and labs.</div>
						<div class="resume-detail-bullet">- Keep materials prepared for internships, research, and review.</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.resume-entry-mask {
		position: absolute;
		inset: 0;
		z-index: 9;
		overflow: hidden;
		background: #0047ff;
		clip-path: circle(0 at 50% 50%);
		animation: resume-entry-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		pointer-events: none;
	}

	.resume-entry-video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.resume-overlay {
		position: absolute;
		inset: 0;
		z-index: 10;
		pointer-events: none;
	}

	.resume-stack {
		position: absolute;
		top: 9vh;
		left: 2.8vw;
		width: min(47vw, 720px);
		display: flex;
		flex-direction: column;
		gap: 10px;
		pointer-events: none;
		transform: scale(0.9);
		transform-origin: top left;
	}

	.resume-list-tag {
		font-family: 'Anton', sans-serif;
		font-size: 92px;
		line-height: 0.9;
		color: #f6fbff;
		letter-spacing: 2px;
		margin: 0 0 6px 12px;
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.18);
		opacity: 0;
		transform: translateX(-24px);
		transition: opacity 0.35s ease, transform 0.35s ease;
	}

	.resume-list-tag.mounted {
		opacity: 1;
		transform: translateX(0);
	}

	.resume-card-wrap {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		font: inherit;
		text-align: left;
		opacity: 0;
		transform: translateX(-48px);
		transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
		pointer-events: all;
		cursor: pointer;
	}

	.resume-card-wrap.mounted {
		opacity: 1;
		transform: translateX(0);
	}

	.resume-card {
		position: relative;
		height: 112px;
		background: #10185f;
		clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
		box-shadow: 0 8px 0 rgba(5, 13, 59, 0.85);
		transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
		overflow: visible;
	}

	.resume-card-wrap.active .resume-card {
		background: #fff;
		box-shadow: 10px 8px 0 #d63232;
		transform: translateX(6px);
	}

	.resume-card-inner {
		position: absolute;
		inset: 0;
		padding: 14px 22px 14px 62px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.resume-badge {
		position: absolute;
		top: 10px;
		left: -10px;
		width: 56px;
		height: 70px;
		background: #0b113d;
		border: 3px solid #9cf7ff;
		clip-path: polygon(14% 0, 100% 0, 84% 100%, 0 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		transform: rotate(-8deg);
		box-shadow: 0 4px 0 rgba(0, 0, 0, 0.28);
		transition: background 0.22s ease, border-color 0.22s ease;
	}

	.resume-badge-text {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 36px;
		color: #d2fdff;
		letter-spacing: 1px;
		transform: rotate(8deg);
	}

	.resume-card-wrap.active .resume-badge {
		background: #000;
		border-color: #000;
	}

	.resume-card-wrap.active .resume-badge-text {
		color: #fff;
	}

	.resume-title {
		font-family: 'Anton', sans-serif;
		font-size: 56px;
		line-height: 0.9;
		letter-spacing: 1px;
		color: #a5f6ff;
		transition: color 0.22s ease;
	}

	.resume-card-wrap.active .resume-title,
	.resume-card-wrap.active .resume-rank-label,
	.resume-card-wrap.active .resume-rank-number {
		color: #000;
	}

	.resume-rank {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 2px;
		flex-shrink: 0;
	}

	.resume-rank-label,
	.resume-rank-number,
	.resume-subtitle,
	.resume-detail-status {
		font-family: 'Bebas Neue', sans-serif;
	}

	.resume-rank-label {
		font-size: 28px;
		letter-spacing: 2px;
		color: #9ffbff;
		transition: color 0.22s ease;
	}

	.resume-rank-number {
		font-family: 'Anton', sans-serif;
		font-size: 70px;
		line-height: 0.82;
		color: #9ffbff;
		transition: color 0.22s ease;
	}

	.resume-subtitle-bar {
		position: absolute;
		left: 64px;
		right: 14px;
		bottom: 12px;
		height: 34px;
		background: #85f4ff;
		clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
		display: flex;
		align-items: center;
		padding: 0 18px;
		transition: background 0.22s ease;
	}

	.resume-card-wrap.active .resume-subtitle-bar {
		background: #000;
	}

	.resume-subtitle {
		font-size: 28px;
		line-height: 1;
		letter-spacing: 1px;
		color: #041238;
		transition: color 0.22s ease;
	}

	.resume-card-wrap.active .resume-subtitle {
		color: #fff;
	}

	.resume-detail-panel {
		position: absolute;
		top: 9.5vh;
		right: 4.5vw;
		width: min(39vw, 620px);
		min-height: 74vh;
		z-index: 12;
		padding: 22px 24px 24px;
		background: linear-gradient(180deg, rgba(15, 28, 105, 0.96), rgba(8, 16, 68, 0.97));
		clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
		box-shadow: inset 0 0 0 1px rgba(133, 244, 255, 0.16), 16px 16px 0 rgba(0, 6, 30, 0.55);
		overflow: hidden;
	}

	.resume-detail-panel::before {
		content: "";
		position: absolute;
		inset: 0;
		background:
			linear-gradient(135deg, rgba(133, 244, 255, 0.08) 0 15%, transparent 15% 100%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 24%);
		pointer-events: none;
	}

	.resume-detail-top {
		position: relative;
		display: grid;
		grid-template-columns: 70px 1fr auto;
		align-items: center;
		gap: 14px;
		min-height: 92px;
		padding: 0 18px;
		background: linear-gradient(90deg, #8ef5ff, #d3fdff);
		clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
		color: #08153f;
		box-shadow: 10px 0 0 rgba(255, 94, 136, 0.88);
	}

	.resume-detail-top-index,
	.resume-detail-top-title,
	.resume-detail-row-title,
	.resume-detail-bullet {
		font-family: 'Anton', sans-serif;
	}

	.resume-detail-top-index { font-size: 46px; line-height: 1; }
	.resume-detail-top-title { font-size: 42px; line-height: 0.92; letter-spacing: 1px; }
	.resume-detail-top-progress { font-family: 'Bebas Neue', sans-serif; font-size: 42px; letter-spacing: 2px; }

	.resume-detail-list {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 18px;
	}

	.resume-detail-row {
		display: grid;
		grid-template-columns: 50px 1fr auto;
		align-items: center;
		gap: 14px;
		min-height: 56px;
		padding: 0 14px;
		background: rgba(8, 18, 72, 0.96);
		clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
		box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.12);
		transition: transform 0.16s ease, background 0.16s ease;
	}

	.resume-detail-row:hover {
		transform: translateX(4px);
		background: rgba(12, 26, 94, 1);
	}

	.resume-detail-row-index {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 26px;
		letter-spacing: 1px;
		color: #94f4ff;
	}

	.resume-detail-row-title {
		font-size: 28px;
		line-height: 1;
		color: #f2fcff;
	}

	.resume-detail-status {
		font-size: 22px;
		letter-spacing: 1.1px;
		color: #06133b;
		background: #8df6ff;
		padding: 7px 12px;
		clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
	}

	.resume-detail-bottom {
		position: relative;
		margin-top: 22px;
		padding: 18px;
		background: rgba(5, 13, 57, 0.97);
		clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
		box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.12);
	}

	.resume-detail-bottom-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 30px;
		letter-spacing: 2px;
		color: #91f5ff;
		margin-bottom: 14px;
	}

	.resume-detail-bullets {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.resume-detail-bullet {
		font-size: 21px;
		line-height: 1.15;
		color: #edfaff;
	}

	@keyframes resume-entry-reveal {
		from { clip-path: circle(0 at 50% 50%); }
		to { clip-path: circle(150vmax at 50% 50%); }
	}
</style>
