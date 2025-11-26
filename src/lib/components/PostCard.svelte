<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Pen from '@lucide/svelte/icons/pen';
	import type { Post } from '../../types';
	import Button from './ui/button/button.svelte';
	import { Content } from './ui/card';
	import CardFooter from './ui/card/card-footer.svelte';
	import CardHeader from './ui/card/card-header.svelte';
	import Card from './ui/card/card.svelte';
	import { DropdownMenu } from './ui/dropdown-menu';
	import DropdownMenuTrigger from './ui/dropdown-menu/dropdown-menu-trigger.svelte';
	import DropdownMenuContent from './ui/dropdown-menu/dropdown-menu-content.svelte';
	import DropdownMenuGroup from './ui/dropdown-menu/dropdown-menu-group.svelte';
	import DropdownMenuLabel from './ui/dropdown-menu/dropdown-menu-label.svelte';
	import DropdownMenuSeparator from './ui/dropdown-menu/dropdown-menu-separator.svelte';
	import DropdownMenuItem from './ui/dropdown-menu/dropdown-menu-item.svelte';
	import Avatar from './ui/avatar/avatar.svelte';
	import AvatarImage from './ui/avatar/avatar-image.svelte';
	import AvatarFallback from './ui/avatar/avatar-fallback.svelte';
	import { deletePost } from '@/hooks/deletePost';
	import Spinner from './ui/spinner/spinner.svelte';
	import { removePost, updatePostStore } from '@/stores/posts';
	import { Dialog } from './ui/dialog';
	import DialogContent from './ui/dialog/dialog-content.svelte';
	import DialogHeader from './ui/dialog/dialog-header.svelte';
	import DialogTitle from './ui/dialog/dialog-title.svelte';
	import DialogDescription from './ui/dialog/dialog-description.svelte';
	import { sesionStore } from '@/stores/usuario';

	interface postProp {
		post: Post;
		postAModificar: Post | null;
	}

	let { post, postAModificar = $bindable() }: postProp = $props();

	let cargandoBorrar = $state(false);
	let mensajeError = $state('');
	let cargandoEditar = $state(false);

	async function handleBorrar() {
		await deletePost(
			post,
			() => {
				removePost(post.id);
			},
			cargandoBorrar,
			mensajeError
		);
	}

	async function handleEditar() {
		postAModificar = post;
	}
</script>

<Card>
	<CardHeader>
		<div class="flex flex-col">
			<div class="flex items-center justify-between">
				<div class="flex gap-3">
					<Avatar>
						<AvatarImage></AvatarImage>
						<AvatarFallback>{post.authorDisplayName[0].toUpperCase()}</AvatarFallback>
					</Avatar>
					<div class="flex space-x-2">
						<span class="text-lg font-medium">{post.authorDisplayName}</span>
						<span class="text-lg text-muted-foreground">@{post.authorName}</span>
					</div>
				</div>
				{#if post.authorName === $sesionStore?.username}
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="ghost" class="rounded-full"><Ellipsis /></Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuGroup>
								<DropdownMenuLabel>Opciones Publicación</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem class="flex gap-2" onclick={() => handleEditar()}>
									<Pen /> Editar
								</DropdownMenuItem>
								<DropdownMenuItem
									class="flex gap-2"
									onclick={() => {
										handleBorrar();
									}}
								>
									{#if cargandoBorrar}
										<Spinner class="text-red-500" />
									{:else}
										<Trash2 class="text-red-500" />
									{/if}
									<p class="text-red-500">Borrar</p>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				{/if}
			</div>
		</div>
	</CardHeader>
	<Content>
		<p class="text-sm">{post.content}</p>
		{#if post.imageUrl}
			<img src={post.imageUrl} alt="Post" class="mt-2 rounded-md" />
		{/if}
	</Content>
	<CardFooter>
		<div class="flex items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
			<span>{post.likesCount} likes</span>
			<span>{post.repliesCount} replies</span>
			<span class="text-xs text-muted-foreground"
				>{post.createdAt.replace('T', ' ').split('.')[0]}</span
			>
			{#if post.isEdited}
				<span>Editado</span>
			{/if}
		</div>
	</CardFooter>
</Card>
{#if mensajeError}
	<Dialog>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Hubo un fallo</DialogTitle>
				<DialogDescription>
					{mensajeError}
				</DialogDescription>
			</DialogHeader>
		</DialogContent>
	</Dialog>
{/if}
