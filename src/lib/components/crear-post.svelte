<script>
	import InputGroupAddon from './ui/input-group/input-group-addon.svelte';
	import InputGroupButton from './ui/input-group/input-group-button.svelte';
	import InputGroupTextarea from './ui/input-group/input-group-textarea.svelte';
	import InputGroup from './ui/input-group/input-group.svelte';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import Kbd from './ui/kbd/kbd.svelte';

	let mensaje = $state('');
</script>

<InputGroup>
	<InputGroupTextarea bind:value={mensaje} maxlength="255" placeholder="Alguna novedad?"
	></InputGroupTextarea>
	<!-- <hr class="w-full" /> -->
	<InputGroupAddon align="block-end" class="bg-">
		<div class="flex w-full justify-between">
			<Kbd class="text-sm leading-none font-medium italic">
				<p class:text-red-500={mensaje.length > 229}>
					{mensaje.length}
				</p>
				/ 255
			</Kbd>
			<InputGroupButton
				variant="default"
				class="transform rounded-full transition-transform ease-in hover:scale-120"
				size="xs"
			>
				<p>Publicar</p>
				<ArrowUpIcon />
			</InputGroupButton>
		</div>
	</InputGroupAddon>
</InputGroup>
