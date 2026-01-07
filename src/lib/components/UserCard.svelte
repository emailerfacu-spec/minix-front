<script lang="ts">
	import { resolve } from '$app/paths';
	import type { UserResponseDto } from '../../types';
	import BotonSeguir from './BotonSeguir.svelte';
	import AvatarFallback from './ui/avatar/avatar-fallback.svelte';
	import AvatarImage from './ui/avatar/avatar-image.svelte';
	import Avatar from './ui/avatar/avatar.svelte';
	import Button from './ui/button/button.svelte';
	import CardContent from './ui/card/card-content.svelte';
	import CardHeader from './ui/card/card-header.svelte';
	import CardTitle from './ui/card/card-title.svelte';
	import Card from './ui/card/card.svelte';

	interface Props {
		usu: UserResponseDto;
	}

	let { usu }: Props = $props();
</script>

<Card class="w-[50%]">
	<CardContent>
		<div class="flex justify-between">
			<a class="flex items-center gap-2" href={resolve(`/${usu.username}`)}>
				<Avatar>
					<AvatarImage src={usu.profileImageUrl}></AvatarImage>
					<AvatarFallback>{usu.displayName[0]}</AvatarFallback>
				</Avatar>
				<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
					{usu.displayName}
				</h4>
				<p class="text-sm text-muted-foreground">@{usu.username}</p>
			</a>
			<div>
				<BotonSeguir post={{ authorId: usu.id }} />
			</div>
		</div>
		{#if usu.bio}
			<div class="mt-4 rounded-full bg-accent p-4 text-muted-foreground">{usu.bio}</div>
		{/if}
	</CardContent>
</Card>
