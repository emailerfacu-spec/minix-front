<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
	import MessageCircle from '@lucide/svelte/icons/message-circle-more';
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
	import { likePost } from '@/hooks/likePost';

	interface postProp {
		post: Post;
		postAModificar: Post | null;
	}

	let { post, postAModificar = $bindable() }: postProp = $props();

	let cargandoBorrar = $state(false);
	let mensajeError = $state('');
	let cargandoEditar = $state(false);
	let cargandoLike = $state(false);
	let errorLike = $state(false);

	let contenido = $derived(() => {
		let t = post.content.replaceAll('\n', '<br>');
		t = t.replace(
			/#\p{L}*/u,
			(match) =>
				`<a class="hover:text-blue-200 text-blue-400" href="/htag/${match.replace('#', '')}">${match}</a>`
		);
		return t;
	});

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

	function handleEditar() {
		postAModificar = post;
	}

	async function likeHandler() {
		cargandoLike = true;
		let { message, ok } = await likePost(post);
		if (ok) {
			if (post.isLiked) {
				post.likesCount--;
			} else {
				post.likesCount++;
			}
			post.isLiked = !post.isLiked;
		} else {
			errorLike = true;
			mensajeError = message;
		}
		updatePostStore(post.id, post);
		cargandoLike = false;
	}
</script>

<Card>
	<CardHeader>
		<div class="flex flex-col">
			<div class="flex items-center justify-between">
				<div class="flex gap-3">
					<a href={`/${post.authorName}`}>
						<Avatar>
							<AvatarImage src={post.authorImageUrl}></AvatarImage>
							<AvatarFallback>{post.authorDisplayName[0].toUpperCase()}</AvatarFallback>
						</Avatar>
					</a>
					<div class="flex space-x-2">
						<span class="text-lg font-medium">{post.authorDisplayName}</span>
						<span class="text-lg text-muted-foreground">@{post.authorName}</span>
					</div>
				</div>
				{#if post.authorName === $sesionStore?.username}
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="ghost" class=" rounded-full bg-accent"><Ellipsis /></Button>
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
	<Content class="mx-5 -mt-4 rounded-lg bg-accent p-3">
		<p class=" text-sm">{@html contenido()}</p>
	</Content>

	{#if post.imageUrl}
		<div class="flex justify-center">
			<Content class="mx-5 max-w-[25%] rounded-4xl bg-accent p-6">
				<img src={post.imageUrl} alt="Post" class="mt-2 rounded-md" />
			</Content>
		</div>
	{/if}
	<CardFooter>
		<div class="-mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
			<Button
				variant="ghost"
				disabled={!$sesionStore?.accessToken}
				class={`${post.isLiked ? 'bg-blue-500/30' : 'bg-accent'} flex items-center gap-2 rounded-full p-3 text-lg`}
				onclick={() => likeHandler()}
			>
				<p>
					{post.likesCount}
				</p>
				<ThumbsUp />
			</Button>
			<Button variant="ghost" class="flex items-center gap-2 rounded-full bg-accent p-3 text-lg">
				<p>
					{post.repliesCount}
				</p>
				<MessageCircle />
			</Button>

			<span class="text-xs text-muted-foreground"
				>{post.createdAt.replace('T', ' ').split('.')[0]}</span
			>
			{#if post.isEdited}
				<span>Editado</span>
			{/if}
		</div>
	</CardFooter>
</Card>
{#if mensajeError || errorLike}
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
