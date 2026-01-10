<script lang="ts">
	import { page } from '$app/state';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import CardTitle from '@/components/ui/card/card-title.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import UserCard from '@/components/UserCard.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	let { data } = $props();
</script>

<div class="flex min-h-fit w-full flex-col items-center justify-center gap-2 p-6 md:p-10">
	<div class="flex w-full max-w-6xl flex-col gap-2">
		<h1 class="text-2xl font-bold">Usuarios</h1>
		<Separator></Separator>
		{#each data.usuarios as usu}
			<div class="w-full">
				<UserCard {usu} />
			</div>
		{/each}

		<div class="mt-4">
			<h2 class="mb-2 text-xl font-semibold">Hastags</h2>
		</div>
		<Separator />
		<div class="mt-4 flex flex-col gap-2">
			{#each data.htags as htag}
				<a
					href={`/htag/${htag}`}
					class="w-full rounded-lg bg-accent p-3 text-lg font-medium text-foreground hover:bg-muted"
				>
					<div class="flex justify-between">
						#{htag}
						<ChevronRight />
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>

<svelte:head>
	<meta property="og:title" content="Mini-x" />
	<meta property="og:description" content={`Buscando ${page.params.user}`} />
	<meta property="og:image" content="https://minix-front.vercel.app/x.png" />
	<meta property="og:url" content="https://minix-front.vercel.app/" />
	<meta property="og:type" content="website" />
</svelte:head>
