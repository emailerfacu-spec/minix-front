<script lang="ts">
	import Card from '@/components/ui/card/card.svelte';
	import { Content } from '@/components/ui/card';
	import Spinner from '@/components/ui/spinner/spinner.svelte';
	import type { Post, PostResponseDto } from '../../../types';
	import PostCard from '@/components/PostCard.svelte';
	import ModalEditar from '../../[perfil]/modalEditar.svelte';
	import { fade } from 'svelte/transition';
	import { updatePost } from '@/hooks/updatePost';
	import { invalidate } from '$app/navigation';
	import Separator from '@/components/ui/separator/separator.svelte';
	import CrearPost from '@/components/crear-post.svelte';

	interface Prop {
		data: {
			post: Post;
		};
	}

	let { data }: Prop = $props();
	// $inspect(data);
	let postAModificar: Post | null = $state(null);

	async function handleEditar(e: SubmitEvent) {
		e.preventDefault();
		if (postAModificar == null) return;
		await updatePost(postAModificar, (postnuevo: Post) => invalidate('post:post'), '');
		postAModificar = null;
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
	<!-- <meta name="og:image" content=""> -->
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
			{#each data.respuestas as respuesta}
				<PostCard post={respuesta} bind:postAModificar update={() => invalidate('post:post')} />
			{/each}
		</div>
	</div>
</div>
{#if postAModificar}
	<div in:fade>
		<ModalEditar callbackfn={handleEditar} bind:post={postAModificar} />
	</div>
{/if}

{#snippet Respuesta()}{/snippet}
