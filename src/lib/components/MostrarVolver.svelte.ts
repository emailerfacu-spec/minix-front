export class MostrarVolver {
	scrollY = $state(0);
	value = $derived(this.scrollY > 500);

	constructor() {
		if (typeof window !== 'undefined') {
			$effect(() => {
				const handleScroll = () => {
					this.scrollY = window.scrollY;
				};
				window.addEventListener('scroll', handleScroll);
				return () => window.removeEventListener('scroll', handleScroll);
			});
		}
	}
}
