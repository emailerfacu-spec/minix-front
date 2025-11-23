<script>
	import AvatarFallback from '@/components/ui/avatar/avatar-fallback.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import { DropdownMenu } from '@/components/ui/dropdown-menu';
	import DropdownMenuContent from '@/components/ui/dropdown-menu/dropdown-menu-content.svelte';
	import DropdownMenuGroup from '@/components/ui/dropdown-menu/dropdown-menu-group.svelte';
	import DropdownMenuItem from '@/components/ui/dropdown-menu/dropdown-menu-item.svelte';
	import DropdownMenuSeparator from '@/components/ui/dropdown-menu/dropdown-menu-separator.svelte';
	import DropdownMenuTrigger from '@/components/ui/dropdown-menu/dropdown-menu-trigger.svelte';
	import { logout } from '@/hooks/logout';
	import { sesionStore } from '@/stores/usuario';

	let { menuOpen = false } = $props();
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		<Avatar class="border-2 border-zinc-950">
			<AvatarImage src={$sesionStore?.url} />
			<AvatarFallback>{$sesionStore?.displayName[0]}</AvatarFallback>
		</Avatar>
	</DropdownMenuTrigger>
	<DropdownMenuContent>
		<DropdownMenuGroup>
			<DropdownMenuItem>
				<a href={'/'}> Mi Perfil </a>
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem onclick={async () => await logout(menuOpen)}>Cerrar Sesion</DropdownMenuItem
			>
		</DropdownMenuGroup>
	</DropdownMenuContent>
</DropdownMenu>
