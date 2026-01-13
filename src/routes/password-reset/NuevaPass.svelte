<script>
	import Button from '@/components/ui/button/button.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import Label from '@/components/ui/label/label.svelte';
	import { slide } from 'svelte/transition';
</script>

<div transition:slide>
	<Card>
		<CardContent>
			<h2 class="mb-4 text-2xl font-bold">Crear una Nueva Contraseña</h2>
			<form onsubmit={() => {}}>
				<div class="space-y-4">
					<div>
						<Label for="password" class="mb-1 block text-sm font-medium">Contraseña</Label>
						<Input
							type="password"
							id="password"
							class="w-full px-3 py-2"
							placeholder="Ingresa tu nueva contraseña"
						/>
					</div>
					<div>
						<Label for="confirmPassword" class="mb-1 block text-sm font-medium"
							>Repetir Contraseña</Label
						>
						<Input
							type="password"
							id="confirmPassword"
							class="w-full px-3 py-2"
							placeholder="Repite tu nueva contraseña"
						/>
					</div>
					<Button type="submit">Establecer Contraseña</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
