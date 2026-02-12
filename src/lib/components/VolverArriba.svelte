<script>
	import { fade, scale } from 'svelte/transition';
	import Button from './ui/button/button.svelte';
	import { MostrarVolver } from './MostrarVolver.svelte';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';

	let mostrarVolver = new MostrarVolver();
</script>

{#if mostrarVolver.value}
	<div transition:fade>
		<div class="fixed right-9 bottom-12 flex flex-col gap-2" transition:scale>
			<Button
				onclick={() => {
					window.scrollTo({
						top: 0,
						behavior: 'smooth'
					});
				}}
				class="align-middle"
			>
				Volver
				<ArrowUp />
			</Button>
		</div>
	</div>
{/if}
