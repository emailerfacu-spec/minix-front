<script>
	import AvatarFallback from '@/components/ui/avatar/avatar-fallback.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import CardDescription from '@/components/ui/card/card-description.svelte';
	import CardHeader from '@/components/ui/card/card-header.svelte';
	import CardTitle from '@/components/ui/card/card-title.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import Github from '@lucide/svelte/icons/github';

	let devs = [
		{
			name: 'Fede',
			role: 'Desarrollador Full Stack',
			pic: 'https://avatars.githubusercontent.com/u/61921832?s=64&v=4',
			gh: 'https://github.com/fedpo2'
		},
		{
			name: 'Luca',
			role: 'Desarrollador Frontend',
			pic: 'https://avatars.githubusercontent.com/u/141507149?s=64&v=4',
			gh: 'https://github.com/TroianoLuca2am'
		},
		{
			name: 'Fran',
			role: 'Desarrollador Backend',
			pic: 'https://avatars.githubusercontent.com/u/126514899?s=64&v=4',
			gh: 'https://github.com/franciscorosecerna'
		}
	];
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<h1 class="mb-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
			Sobre Nosotros
		</h1>

		<Separator class="my-2" />
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each devs as dev}
				<Card>
					<CardHeader class="flex flex-col items-center justify-center gap-2">
						<Avatar class="h-24 w-24">
							<AvatarImage src={dev.pic} class="h-24 w-24" />
							<AvatarFallback class="flex h-24 w-24 items-center justify-center text-3xl">
								{dev.name.toLocaleUpperCase()[0]}
							</AvatarFallback>
						</Avatar>
					</CardHeader>
					<CardContent>
						<div>
							<CardTitle>{dev.name}</CardTitle>
							<CardDescription>{dev.role}</CardDescription>
						</div>
						<div class="mt-2">
							<a href={dev.gh}><Github /></a>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</div>
