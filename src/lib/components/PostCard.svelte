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

	interface postProp {
		post: Post;
	}

	let { post }: postProp = $props();
</script>

<Card>
	<CardHeader>
		<div class="flex flex-col">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium">{post.authorId}</span>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button variant="ghost" class="rounded-full"><Ellipsis /></Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuGroup>
							<DropdownMenuLabel>Opciones Publicación</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem><Pen /> Editar</DropdownMenuItem>
							<DropdownMenuItem onclick={() => {}}>
								<Trash2 class="text-red-500" />
								<p class="text-red-500">Borrar</p>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
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
