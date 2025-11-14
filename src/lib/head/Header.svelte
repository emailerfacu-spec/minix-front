<script>
	import { Button } from '../components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '../components/ui/dropdown-menu';
	import ButtonTheme from './ButtonTheme.svelte';
</script>

<header class="border-b bg-background/95 backdrop-blur">
	<div class="container ms-2 flex h-14 items-center">
		<div class="mr-4 hidden md:flex">
			<a href="/" class="mr-6 flex items-center space-x-2">
				<span class="hidden font-bold sm:inline-block">Mini-X</span>
			</a>
			<ButtonTheme />
			<nav class="flex items-center space-x-6 text-sm font-medium">
				<a href="/" class="text-foreground transition-colors hover:text-foreground/80">Inicio</a>
				<a href="/about" class="text-foreground/60 transition-colors hover:text-foreground/80"
					>Acerca de</a
				>
				<a href="/contact" class="text-foreground/60 transition-colors hover:text-foreground/80"
					>Contacto</a
				>
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<nav class="flex items-center space-x-2">
				<DropdownMenu>
					<DropdownMenuTrigger as={Button} variant="ghost" size="sm">Menu</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Perfil</DropdownMenuItem>
						<DropdownMenuItem>Configuración</DropdownMenuItem>
						<DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</nav>
		</div>
	</div>
</header>
