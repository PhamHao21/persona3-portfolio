import { browser } from '$app/environment';

let initialPath = browser ? window.location.pathname : undefined;
let consumed = false;

export function takeMenuEntrance() {
	if (!browser) return true;

	initialPath ??= window.location.pathname;

	if (consumed || initialPath !== '/') return false;

	consumed = true;
	return true;
}
