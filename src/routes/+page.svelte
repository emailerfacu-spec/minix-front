<script lang="ts">
	import Card from '@/components/ui/card/card.svelte';
	import type { Post } from '../types';
	import { Content } from '@/components/ui/card';
  import { apiBase } from '@/stores/url';

  $effect(()=>{
       getPosts();
  });

  let posts: Post[] = $state([]);

  async function getPosts() {
	    const { subscribe } = apiBase;
	    let baseUrl: string = '';

	    subscribe((value) => {
		      baseUrl = value;
	    })();

	    const req = await fetch(`${baseUrl}/api/posts/timeline?pageSize=3`);
	    if (req.ok){
          posts = await req.json();
      }

  }

</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-sm">
		{#if posts.length <= 0}
			<Card>
				<Content>
					<p class=" text-center leading-7 not-first:mt-6">No hay Posts que mostrar</p>
				</Content>
			</Card>
		{:else}
			{#each posts as post}
				<Card>
					<Content>
						<div class="flex flex-col space-y-2">
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium">{post.authorId}</span>
								<span class="text-xs text-muted-foreground"
									>{post.createdAt.toLocaleDateString()}</span
								>
							</div>
							<p class="text-sm">{post.content}</p>
							{#if post.imageUrl}
								<img src={post.imageUrl} alt="Post" class="mt-2 rounded-md" />
							{/if}
							<div class="flex items-center justify-between pt-2 text-xs text-muted-foreground">
								<span>{post.likesCount} likes</span>
								<span>{post.repliesCount} replies</span>
								{#if post.isEdited}
									<span>Editado</span>
								{/if}
							</div>
						</div>
					</Content>
				</Card>
			{/each}
		{/if}
	</div>
</div>
