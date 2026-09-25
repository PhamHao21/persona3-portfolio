<script>
	let { rows = [] } = $props();
</script>

<div class="control-hints" aria-hidden="true">
	{#each rows as row}
		<div class="hint-row">
			<span class="hint-key">{row.key}</span>
			<span class="hint-label">{row.label}</span>
		</div>
	{/each}
</div>

<style>
	.control-hints {
		position: fixed;
		right: 30px;
		bottom: 24px;
		z-index: 130;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 7px;
		font-family: 'Barlow Condensed', sans-serif;
		pointer-events: none;
	}

	.hint-row {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 9px;
		color: rgba(220, 247, 255, 0.56);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 2px;
		line-height: 1;
		text-transform: uppercase;
	}

	.hint-key {
		min-width: 74px;
		padding: 7px 10px 6px;
		border-left: 3px solid #ff496b;
		color: #07113e;
		background: rgba(245, 252, 255, 0.82);
		text-align: center;
		letter-spacing: 1.3px;
		clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
	}

	.hint-label { min-width: 72px; }

	@media (max-width: 800px) {
		.control-hints { display: none; }
	}
</style>
