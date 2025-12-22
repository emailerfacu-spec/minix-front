<script lang="ts">
	import PostCard from '@/components/PostCard.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import CardTitle from '@/components/ui/card/card-title.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import type { Post } from '../../../types.js';
	import ModalEditar from '../../[perfil]/modalEditar.svelte';
	import { fade } from 'svelte/transition';
	import { updatePostStore } from '@/stores/posts';
	import { updatePost } from '@/hooks/updatePost';
	import Separator from '@/components/ui/separator/separator.svelte';

	interface props {
		data: {
			htag: string;
			cantidad: [Post];
		};
	}
	let { data }: props = $props();
	let posts = $state(data.cantidad);
	let postsfiltro = $derived(
		posts.filter((x) => {
			const regex = new RegExp(`#${data.htag}\\b`, 'gm');
			return regex.test(x.content);
		})
	);
	let postAModificar: Post | null = $state(null);

	async function handleEditar(e: SubmitEvent) {
		e.preventDefault();
		if (postAModificar == null) return;
		await updatePost(
			postAModificar,
			(postnuevo: Post) => updatePostStore(postAModificar!.id, postnuevo),

			''
		);
		postAModificar = null;
	}
</script>

<div class="flex min-h-fit w-full flex-col items-center justify-center pt-2">
	<div class="w-full max-w-6xl">
		<Card>
			<CardHeader>
				<CardTitle>
					<h1
						class="mb-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl"
					>
						#{data.htag}
					</h1>
					<Separator></Separator>
					Uso del hashtag:
					<span class="text-blue-500"> </span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p>El hashtag se ha utilizado {data.cantidad} veces</p>
			</CardContent>
		</Card>
		<hr class="my-2" />

		<div class="mt-1">
			{#each postsfiltro as post}
				<PostCard {post} bind:postAModificar />
			{/each}
		</div>
	</div>
</div>
{#if postAModificar}
	<div in:fade>
		<ModalEditar callbackfn={handleEditar} bind:post={postAModificar} />
	</div>
{/if}
