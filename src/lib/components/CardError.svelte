<script>
	import { fade } from 'svelte/transition';
	import Card from './ui/card/card.svelte';
	import CardContent from './ui/card/card-content.svelte';
	import Ban from '@lucide/svelte/icons/ban';

	let { mensajeError } = $props();
</script>

<div in:fade>
	<Card class="border-red-500">
		<CardContent class="flex w-full flex-col items-center justify-center">
			<Ban class="scale-120 text-red-500"></Ban>
			<p class="mt-2 text-lg leading-7 text-red-500">
				{mensajeError}
			</p>
		</CardContent>
	</Card>
</div>
