<script lang="ts">
	import InputGroupAddon from './ui/input-group/input-group-addon.svelte';
	import InputGroupButton from './ui/input-group/input-group-button.svelte';
	import InputGroupTextarea from './ui/input-group/input-group-textarea.svelte';
	import InputGroup from './ui/input-group/input-group.svelte';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import Paperclip from '@lucide/svelte/icons/paperclip';
	import Trash from '@lucide/svelte/icons/trash-2';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import Kbd from './ui/kbd/kbd.svelte';
	import { Tooltip } from './ui/tooltip';
	import TooltipContent from './ui/tooltip/tooltip-content.svelte';
	import TooltipTrigger from './ui/tooltip/tooltip-trigger.svelte';
	import { publicarPost } from '@/hooks/publicarPost';
	import { filtrarImagen } from '@/utils';
	import { invalidate } from '$app/navigation';

	let { placeholder, parentPostId }: { placeholder?: string; parentPostId?: string } = $props();

	let mensaje = $state('');
	let imagen: File | null = $state(null);
	let hoverimg = $state(false);

	let cargando = $state(false);
	let mostrarError = $state('');

	async function handlePost(e: Event) {
		e.preventDefault();
		cargando = true;
		const formData = new FormData();
		formData.append('content', mensaje);
		if (imagen) {
			formData.append('image', imagen);
		}
		if (parentPostId) formData.append('parentPostId', parentPostId);
		mostrarError = await publicarPost(formData);
		if (mostrarError == '') {
			mensaje = '';
			imagen = null;
		}
		cargando = false;
		if (parentPostId) invalidate('post:respuestas');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.ctrlKey && e.key === 'Enter') {
			handlePost(e);
		}
	}

	function handleDrop(e: Event) {
		e.preventDefault();
		const dt = (e as DragEvent).dataTransfer;
		const file = dt?.files?.[0];
		if (file === undefined) return;
		imagen = filtrarImagen(file);
	}
	function seleccionarImagen() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.png,.jpg,.jpeg,.gif,.webp';
		input.onchange = () => {
			const file = input.files?.[0];
			if (file === undefined) return;
			imagen = filtrarImagen(file);
		};
		input.click();
	}
</script>

<form onsubmit={(e: Event) => handlePost(e)}>
	<InputGroup>
		<InputGroupTextarea
			bind:value={mensaje}
			ondragover={(e) => {
				e.preventDefault();
			}}
			ondrop={handleDrop}
			maxlength={280}
			placeholder={placeholder ? placeholder : 'Alguna novedad?'}
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
					{#if imagen}
						<button class="h-6 w-6 overflow-hidden rounded-full" onclick={() => (imagen = null)}>
							<div class="relative h-full w-full">
								<div
									class="relative h-full w-full"
									role="presentation"
									onmouseenter={() => (hoverimg = true)}
									onmouseleave={() => (hoverimg = false)}
								>
									<div class={{ 'brightness-50': hoverimg }}>
										<img
											src={URL.createObjectURL(imagen)}
											alt="imagen seleccionada"
											class="h-full w-full object-cover"
											onload={(e) => {
												const target = e.currentTarget as HTMLImageElement;
												URL.revokeObjectURL(target.src);
											}}
										/>
									</div>
									<div
										class="absolute inset-0 flex items-center justify-center"
										class:opacity-100={hoverimg}
										class:opacity-0={!hoverimg}
									>
										<Trash class="h-4 w-4 text-white" />
									</div>
								</div>
							</div>
						</button>
					{/if}
					<InputGroupButton
						size="icon-sm"
						variant="outline"
						onclick={seleccionarImagen}
						class={`${imagen ? 'bg-blue-500/30!' : ''} rounded-full`}
					>
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
