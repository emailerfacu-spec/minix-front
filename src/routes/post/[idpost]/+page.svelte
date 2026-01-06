<script lang="ts">
	import Card from '@/components/ui/card/card.svelte';
	import { Content } from '@/components/ui/card';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import type { Post } from '../../../types';
	import PostCard from '@/components/PostCard.svelte';
	import ModalEditar from '../../[perfil]/modalEditar.svelte';
	import { fade, slide } from 'svelte/transition';
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
	import { TamañoPantalla } from './TamañoPantalla.svelte';

	interface Prop {
		data: {
			post: Post;
			respuestas: Post[];
		};
	}

	let tamaño = new TamañoPantalla();

	let { data }: Prop = $props();
	// $inspect(data);
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
			<div class="sticky top-0 z-10 w-full rounded-xl bg-background p-2">
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
			{#each data.respuestas as respuesta (respuesta.id)}
				<!-- {#if tamaño.isMobile} -->
				<!-- {#if true} -->
				{@render Respuesta(respuesta)}
				<!-- {:else} -->
				<!-- <PostCard post={respuesta} bind:postAModificar update={() => invalidate('post:post')} /> -->
				<!-- {/if} -->
			{/each}
		</div>
	</div>
</div>
{#if postAModificar}
	<div in:fade>
		<ModalEditar callbackfn={handleEditar} bind:post={postAModificar} />
	</div>
{/if}

{#snippet Respuesta(post: Post)}
	<div class="ml-2 flex-1">
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
