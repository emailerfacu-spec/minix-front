<script lang="ts">
	import { InputGroup } from '@/components/ui/input-group';
	import InputGroupAddon from '@/components/ui/input-group/input-group-addon.svelte';
	import InputGroupButton from '@/components/ui/input-group/input-group-button.svelte';
	import InputGroupTextarea from '@/components/ui/input-group/input-group-textarea.svelte';
	import Kbd from '@/components/ui/kbd/kbd.svelte';
	import type { Post } from '../../types';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import { Dialog } from '@/components/ui/dialog';
	import DialogContent from '@/components/ui/dialog/dialog-content.svelte';
	import DialogDescription from '@/components/ui/dialog/dialog-description.svelte';
	import DialogHeader from '@/components/ui/dialog/dialog-header.svelte';
	import DialogTitle from '@/components/ui/dialog/dialog-title.svelte';

	interface Props {
		post: Post | null;
		callbackfn: Function;
	}
	let { post = $bindable(), callbackfn }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.ctrlKey && e.key === 'Enter') {
			callbackfn(e);
		}
	}
</script>

<Dialog open={true} onOpenChange={() => (post = null)}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Editar Publicacion</DialogTitle>
		</DialogHeader>
		<DialogDescription>
			<form
				onsubmit={(e: SubmitEvent) => {
					callbackfn(e);
				}}
			>
				<InputGroup>
					<InputGroupTextarea
						bind:value={post!.content}
						maxlength={280}
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
							<InputGroupButton
								variant="default"
								type="submit"
								class="transform rounded-full transition-transform ease-in hover:scale-120"
								size="xs"
							>
								<p>Modificar</p>
								<ArrowUpIcon />
							</InputGroupButton>
						</div>
					</InputGroupAddon>
				</InputGroup>
			</form>
		</DialogDescription>
	</DialogContent>
</Dialog>
