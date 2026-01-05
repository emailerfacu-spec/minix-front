import { innerWidth } from 'svelte/reactivity/window';
export class TamañoPantalla {
	width = $derived(() => innerWidth.current || 1080);
	isMobile = $derived(this.width() < 768);
}
