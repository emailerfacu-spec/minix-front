<script lang="ts">
	import InputGroupAddon from './ui/input-group/input-group-addon.svelte';
	import InputGroupButton from './ui/input-group/input-group-button.svelte';
	import InputGroupTextarea from './ui/input-group/input-group-textarea.svelte';
	import InputGroup from './ui/input-group/input-group.svelte';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import Paperclip from '@lucide/svelte/icons/paperclip';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import Kbd from './ui/kbd/kbd.svelte';

	import { apiBase } from '@/stores/url';
	import { sesionStore } from '@/stores/usuario';
	import type { CreatePostDto } from '../../types';
	import { addPost } from '@/stores/posts';
	import { Tooltip } from './ui/tooltip';
	import TooltipContent from './ui/tooltip/tooltip-content.svelte';
	import TooltipTrigger from './ui/tooltip/tooltip-trigger.svelte';
	import { publicarPost } from '@/hooks/publicarPost';
	import Button from './ui/button/button.svelte';
	import InputGroupInput from './ui/input-group/input-group-input.svelte';

	let mensaje = $state('');

	let cargando = $state(false);
	let mostrarError = $state('');

	async function handlePost(e: Event) {
		e.preventDefault();
		cargando = true;
		const formData = new FormData();
		formData.append('content', mensaje);
		// formData.append('imageUrl', '');
		// formData.append('parentPostId', '');
		mostrarError = await publicarPost(formData);
		if (mostrarError == '') mensaje = '';
		cargando = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.ctrlKey && e.key === 'Enter') {
			handlePost(e);
		}
	}
</script>

<form onsubmit={(e: Event) => handlePost(e)}>
	<InputGroup>
		<InputGroupTextarea
			bind:value={mensaje}
			maxlength={280}
			placeholder="Alguna novedad?"
			onkeydown={handleKeydown}
		></InputGroupTextarea>

		<InputGroupAddon align="block-end" class="bg-">
			<div class="flex w-full justify-between">
				<Kbd class="text-sm leading-none font-medium italic">
					<p class:text-red-500={mensaje.length > 239}>
						{mensaje.length}
					</p>
					/ 280
				</Kbd>
				<div class="flex items-center gap-2">
					<InputGroupButton size="icon-sm" variant="outline" class="rounded-full">
						<Paperclip />
					</InputGroupButton>
					<Tooltip>
						<TooltipTrigger class="*: flex">
							<InputGroupButton
								variant="default"
								disabled={cargando}
								type="submit"
								class="transform rounded-full transition-transform ease-in hover:scale-120"
								size="xs"
							>
								{#if cargando}
									<Loader2Icon class="animate-spin" />
									Publicando...
								{:else}
									Publicar
									<ArrowUpIcon class="mt-0.5 h-3.5! w-3.5!" />
								{/if}
							</InputGroupButton>
						</TooltipTrigger>
						<TooltipContent>
							<Kbd>Ctrl</Kbd>+<Kbd>Enter</Kbd>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</InputGroupAddon>
	</InputGroup>
</form>
