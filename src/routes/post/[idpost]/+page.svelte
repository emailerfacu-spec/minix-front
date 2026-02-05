<script lang="ts">
	import Card from '@/components/ui/card/card.svelte';
	import { Content } from '@/components/ui/card';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import type { Post } from '../../../types';
	import PostCard from '@/components/PostCard.svelte';
	import ModalEditar from '../../[perfil]/modalEditar.svelte';
	import { fade } from 'svelte/transition';
	import { updatePost } from '@/hooks/updatePost';
	import { goto, invalidate } from '$app/navigation';
	import Separator from '@/components/ui/separator/separator.svelte';
	import CrearPost from '@/components/crear-post.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';
	import MessageCircleMore from '@lucide/svelte/icons/message-circle-more';
	import { sesionStore } from '@/stores/usuario';
	import { likePost } from '@/hooks/likePost';
	import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
	import BotonSeguir from '@/components/BotonSeguir.svelte';
	import Pen from '@lucide/svelte/icons/pen';
	import Trash_2 from '@lucide/svelte/icons/trash-2';
	import { Tooltip } from '@/components/ui/tooltip';
	import TooltipTrigger from '@/components/ui/tooltip/tooltip-trigger.svelte';
	import TooltipContent from '@/components/ui/tooltip/tooltip-content.svelte';
	import { deletePost } from '@/hooks/deletePost';
	import { flip } from 'svelte/animate';
	import { obtenerRespuestasPorId } from '@/hooks/obtenerRespuestasPorId';
	import VolverArriba from '@/components/VolverArriba.svelte';

	interface Prop {
		data: {
			post: Post;
			respuestas: Post[];
		};
	}

	let { data }: Prop = $props();

	let respuestasPaginadas: Post[] = $state([]);
	let pagerespuestas: number = $state(1);

	let seguirMostrandoMostrarMás = $derived.by(() => {
		if (data.post.repliesCount <= 20) return false;
		if (respuestasPaginadas.length == 0) return true;
		return data.respuestas.length + respuestasPaginadas.length < data.post.repliesCount;
	});
	// $inspect([respuestasPaginadas, seguirMostrandoMostrarMás]);

	let postAModificar: Post | null = $state(null);

	async function handleEditar(e: SubmitEvent) {
		e.preventDefault();
		if (postAModificar == null) return;
		await updatePost(postAModificar, (postnuevo: Post) => invalidate('post:post'), '');
		postAModificar = null;
	}

	async function likeHandler(post: Post) {
		//para que se vea el spinner
		let [{ message, ok }] = await Promise.all([
			likePost(post),
			new Promise((resolve) => setTimeout(resolve, 300))
		]);
		if (ok) {
			if (post.isLiked) {
				post.likesCount--;
			} else {
				post.likesCount++;
			}
			post.isLiked = !post.isLiked;
		} else {
		}
		invalidate('post:respuestas');
	}
</script>

<svelte:head>
	<title
		>@{data.post.authorName} - {data.post?.content.substring(0, 7) ?? 'Post'}{data.post?.content
			.length > 7
			? '...'
			: ''}
	</title>
	<meta name="og:description" content={data.post?.content?.slice(0, 150)} />
	{#if data.post?.imageUrl}
		<meta name="og:image" content={data.post.imageUrl} />
	{:else}
		<meta name="og:image" content={`/post/img/${data.post.id}`} />
	{/if}
</svelte:head>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		{#if data.post}
			<div class="top-1 z-10 w-full rounded-xl bg-background p-2">
				<PostCard post={data.post} bind:postAModificar update={() => invalidate('post:post')} />
			</div>
		{:else}
			<Card>
				<Content class="flex items-center gap-2">
					<Spinner class="h-6 w-6" />
					<span>Cargando post…</span>
				</Content>
			</Card>
		{/if}
		<div class="my-4">
			<Separator></Separator>
		</div>
		<CrearPost placeholder={`Responder a @${data.post.authorName}`} parentPostId={data.post.id} />

		<div class="my-4">
			<Separator></Separator>
		</div>

		<div class="flex flex-col gap-2">
			{#each [...data.respuestas, ...respuestasPaginadas] as respuesta (respuesta.id)}
				<div transition:fade animate:flip>
					<!-- {#if tamaño.isMobile} -->
					<!-- {#if true} -->
					{@render Respuesta(respuesta)}
					<!-- {:else} -->
					<!-- <PostCard post={respuesta} bind:postAModificar update={() => invalidate('post:post')} /> -->
					<!-- {/if} -->
				</div>
			{/each}
			{#if seguirMostrandoMostrarMás}
				<Button
					variant="link"
					onclick={async () => {
						let ret = await obtenerRespuestasPorId(
							data.post.id,
							undefined,
							undefined,
							++pagerespuestas
						);
						if (ret == null) return;
						if (typeof ret == 'string') return;
						if (ret.length == 0) {
							seguirMostrandoMostrarMás = false;
							return;
						}
						respuestasPaginadas.push(...ret);
					}}>Cargar Más Respuestas</Button
				>
			{/if}
		</div>
	</div>
</div>
{#if postAModificar}
	<div in:fade>
		<ModalEditar callbackfn={handleEditar} bind:post={postAModificar} />
	</div>
{/if}

<VolverArriba />

{#snippet Respuesta(post: Post)}
	<div class="ml-2 flex-1">
		<div class="flex justify-between">
			<div class="flex items-center space-x-1">
				{#if post.authorImageUrl}
					<img
						src={post.authorImageUrl}
						alt={post.authorDisplayName}
						class="h-8 w-8 shrink-0 rounded-full object-cover"
					/>
				{:else}
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-white"
					>
						{post.authorName?.charAt(0).toUpperCase()}
					</div>
				{/if}
				<span class="text-sm font-semibold">@{post.authorName}</span>
				<span class="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
			</div>
			<div class="flex gap-2">
				{#if $sesionStore?.username === post.authorName}
					<Tooltip>
						<TooltipTrigger>
							<Button
								variant="outline"
								size="icon-sm"
								onclick={() => {
									postAModificar = post;
								}}
							>
								<Pen />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Editar</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<Button
								variant="destructive"
								size="icon-sm"
								onclick={async () => {
									await deletePost(
										post,
										() => {
											invalidate('post:respuestas');
										},
										false,
										''
									);
								}}
							>
								<Trash_2 />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Borrar</TooltipContent>
					</Tooltip>
				{/if}
				<BotonSeguir {post} variant="icon-sm" />
			</div>
		</div>
		<p class=" mt-1 line-clamp-2 rounded-md p-2 text-lg">
			{post.content}
		</p>
		{#if post.imageUrl}
			<img src={post.imageUrl} alt="Imagen de respuesta" class="mt-2 h-auto max-w-[50%] rounded" />
		{/if}
		<div class="mt-2 flex gap-2">
			<button
				disabled={!$sesionStore?.accessToken}
				class={`${post.isLiked ? 'bg-blue-500/30' : ''} flex items-center gap-1 rounded-full p-2! text-lg`}
				onclick={() => likeHandler(post)}
			>
				<p>
					{post.likesCount}
				</p>
				<ThumbsUp class="h-5 w-5" />
			</button>
			<button
				class="flex items-center gap-1 rounded-full p-2! text-lg"
				onclick={() => goto(resolve('/post/[idpost]', { idpost: post.id }))}
			>
				<p>
					{post.repliesCount}
				</p>
				<MessageCircleMore class="h-5 w-5" />
			</button>
		</div>
	</div>
	<Separator class="bg-white/50" />
{/snippet}
