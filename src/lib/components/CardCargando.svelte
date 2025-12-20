<script>
	import { slide } from 'svelte/transition';
	import CardContent from './ui/card/card-content.svelte';
	import Card from './ui/card/card.svelte';
	import Spinner from './ui/spinner/spinner.svelte';
</script>

<div out:slide>
	<Card>
		<CardContent class="flex w-full flex-col items-center justify-center">
			<Spinner class="size-9" />
			<p class="leading-7 not-first:mt-6">Cargando</p>
		</CardContent>
	</Card>
</div>
