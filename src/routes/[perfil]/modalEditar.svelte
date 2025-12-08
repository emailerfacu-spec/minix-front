<script lang="ts">
	import { InputGroup } from '@/components/ui/input-group';
	import InputGroupAddon from '@/components/ui/input-group/input-group-addon.svelte';
	import InputGroupButton from '@/components/ui/input-group/input-group-button.svelte';
	import InputGroupTextarea from '@/components/ui/input-group/input-group-textarea.svelte';
	import Kbd from '@/components/ui/kbd/kbd.svelte';
	import Paperclip from '@lucide/svelte/icons/paperclip';
	import Trash from '@lucide/svelte/icons/trash-2';
	import type { Post } from '../../types';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import { Dialog } from '@/components/ui/dialog';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';
	import DialogDescription from '@/components/ui/dialog/dialog-description.svelte';
	import DialogHeader from '@/components/ui/dialog/dialog-header.svelte';
	import DialogTitle from '@/components/ui/dialog/dialog-title.svelte';
	import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
	import TooltipTrigger from '@/components/ui/tooltip/tooltip-trigger.svelte';
	import TooltipContent from '@/components/ui/tooltip/tooltip-content.svelte';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import { filtrarImagen } from '@/utils';

	interface Props {
		post: Post | null;
		callbackfn: Function;
	}
	let { post = $bindable(), callbackfn }: Props = $props();

	let cargando = $state(false);

	async function loadPostImage() {
		if (!post?.imageUrl) return;
		const response = await fetch(post.imageUrl);
		const blob = await response.blob();
		const urlParts = post.imageUrl.split('/');
		const filename = urlParts[urlParts.length - 1] || 'image';
		post.image = new File([blob], filename, { type: blob.type });
	}

	$effect(() => {
		void loadPostImage();
	});

	let hoverimg = $state(false);

	async function handleKeydown(e: KeyboardEvent) {
		if (e.ctrlKey && e.key === 'Enter') {
			cargando = true;
			await callbackfn(e);
			cargando = false;
		}
	}
	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		cargando = true;
		await callbackfn(e);
		cargando = false;
	}
	function seleccionarImagen() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.png,.jpg,.jpeg,.gif,.webp';
		input.onchange = () => {
			const file = input.files?.[0];
			if (file === undefined) return;
			post!.image = filtrarImagen(file);
		};
		input.click();
	}
	function handleDrop(e: Event) {
		e.preventDefault();
		const dt = (e as DragEvent).dataTransfer;
		const file = dt?.files?.[0];
		if (file === undefined) return;
		post!.image = filtrarImagen(file);
	}
</script>

<Dialog open={true} onOpenChange={() => (post = null)}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Editar Publicacion</DialogTitle>
		</DialogHeader>
		<DialogDescription>
			<form {onsubmit}>
				<InputGroup>
					<InputGroupTextarea
						bind:value={post!.content}
						maxlength={280}
						ondragover={(e) => {
							e.preventDefault();
						}}
						ondrop={handleDrop}
						placeholder="Alguna novedad?"
						onkeydown={handleKeydown}
						class="text-white"
					></InputGroupTextarea>

					<InputGroupAddon align="block-end" class="bg-">
						<div class="flex w-full justify-between">
							<Kbd class="text-sm leading-none font-medium italic">
								<p class:text-red-500={post!.content.length > 239}>
									{post!.content.length}
								</p>
								/ 280
							</Kbd>
							<div class="flex items-center gap-2">
								{#if post.image}
									<button
										class="h-6 w-6 overflow-hidden rounded-full"
										onclick={() => (post.image = null)}
									>
										<div class="relative h-full w-full">
											<div
												class="relative h-full w-full"
												role="presentation"
												onmouseenter={() => (hoverimg = true)}
												onmouseleave={() => (hoverimg = false)}
											>
												<div class={{ 'brightness-50': hoverimg }}>
													<img
														src={URL.createObjectURL(post.image)}
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
									class={`${post?.image ? 'bg-blue-500/30!' : ''} rounded-full`}
								>
									<Paperclip />
								</InputGroupButton>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<InputGroupButton
												variant="default"
												disabled={cargando}
												type="submit"
												class="transform rounded-full transition-transform ease-in hover:scale-120"
												size="xs"
											>
												<p class="flex items-center gap-1">
													{#if cargando}
														<Spinner />
														Cargando...
													{:else}
														Modificar
														<ArrowUpIcon class="mt-0.5 h-3.5! w-3.5!" />
													{/if}
												</p>
											</InputGroupButton>
										</TooltipTrigger>
										<TooltipContent>
											<Kbd>Ctrl</Kbd>+<Kbd>Enter</Kbd>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>
					</InputGroupAddon>
				</InputGroup>
			</form>
		</DialogDescription>
	</DialogContent>
</Dialog>
