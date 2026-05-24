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
		right: 46px;
		bottom: 42px;
		z-index: 130;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		font-family: 'Bebas Neue', sans-serif;
		pointer-events: none;
		opacity: 0.46;
	}

	.hint-row {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
		color: rgba(190, 225, 255, 0.7);
		font-size: 20px;
		letter-spacing: 4px;
		line-height: 1;
		text-transform: uppercase;
		text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
	}

	.hint-key {
		min-width: 70px;
		padding: 5px 9px 4px;
		border: 1px solid rgba(170, 219, 255, 0.32);
		border-radius: 4px;
		color: rgba(190, 225, 255, 0.68);
		text-align: center;
		letter-spacing: 2px;
		background: rgba(0, 20, 90, 0.14);
	}

	.hint-label {
		min-width: 112px;
		text-align: left;
		font-weight: 700;
	}
</style>
