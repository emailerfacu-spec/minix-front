<script>
	import { Root } from '@/components/ui/button-group';
	import { Button } from '../components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '../components/ui/dropdown-menu';
	import ButtonTheme from './ButtonTheme.svelte';
	import ButtonGroup from '@/components/ui/button-group/button-group.svelte';

	import { page } from '$app/state';
</script>

<header class="border-b bg-background/95 backdrop-blur">
	<div class="container ms-2 flex h-14 items-center">
		<div class="mr-4 hidden md:flex">
			<a href="/" class="mr-6 flex items-center space-x-2">
				<p class="leading-7 not-first:mt-6">Mini-X</p>
			</a>
			<nav class="flex items-center space-x-6 text-sm font-medium">
				<ButtonTheme />
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<ButtonGroup>
				<Button
					variant={page.url.pathname !== '/login' ? 'outline' : 'secondary'}
					href="/login"
					class="text-foreground/60 transition-colors hover:text-foreground/80"
					>Iniciar Sesion</Button
				>
				<Button
					variant={page.url.pathname !== '/register' ? 'outline' : 'secondary'}
					href="/register"
					class="text-foreground/60 transition-colors hover:text-foreground/80">Registrarse</Button
				>
			</ButtonGroup>
		</div>
	</div>
</header>
