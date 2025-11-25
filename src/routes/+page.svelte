<script lang="ts">
	import Card from '@/components/ui/card/card.svelte';
	import { Content } from '@/components/ui/card';
	import { apiBase } from '@/stores/url';
	import { sesionStore } from '@/stores/usuario';
	import CrearPost from '@/components/crear-post.svelte';
	import { posts, setPosts } from '@/stores/posts';
	import PostCard from '@/components/PostCard.svelte';

	$effect(() => {
		(async () => {
			setPosts(await getPosts());
		})();
	});

	async function getPosts() {
		const { subscribe } = apiBase;
		let baseUrl: string = '';

		subscribe((value) => {
			baseUrl = value;
		})();

		const req = await fetch(`${baseUrl}/timeline?pageSize=20`);
		if (req.ok) {
			return await req.json();
		}
	}
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<div class="flex flex-col gap-2">
			{#if $sesionStore !== null}
				<CrearPost />
			{/if}
			<hr />

			{#if $posts.length <= 0}
				<Card>
					<Content>
						<p class=" text-center leading-7 not-first:mt-6">No hay Posts que mostrar</p>
					</Content>
				</Card>
			{:else}
				{#each $posts as post}
					<PostCard {post} />
				{/each}
			{/if}
		</div>
	</div>
</div>
