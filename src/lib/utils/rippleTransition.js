let runner;

export function setRippleTransitionRunner(nextRunner) {
	runner = nextRunner;

	return () => {
		if (runner === nextRunner) runner = undefined;
	};
}

export function playRippleTransition(source) {
	if (!runner) return Promise.resolve();
	return runner(source);
}
