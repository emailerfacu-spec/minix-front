<script lang="ts">
	import BreadcrumbItem from '@/components/ui/breadcrumb/breadcrumb-item.svelte';
	import BreadcrumbList from '@/components/ui/breadcrumb/breadcrumb-list.svelte';
	import BreadcrumbSeparator from '@/components/ui/breadcrumb/breadcrumb-separator.svelte';
	import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb.svelte';

	import Pasos from './Pasos.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import { slide } from 'svelte/transition';
	import IngresarEmail from './IngresarEmail.svelte';
	import Otp from './Otp.svelte';
	import NuevaPass from './NuevaPass.svelte';

	let estado: 'email' | 'otp' | 'nuevapass' = $state('email');
	let email: string = $state('');
</script>

<div class="flex min-h-fit w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-6xl">
		<Pasos {estado} />
		<div class="mt-6">
			{#if estado === 'email'}
				<IngresarEmail bind:estado bind:email />
			{:else if estado === 'otp'}
				<Otp bind:estado />
			{:else if estado === 'nuevapass'}
				<NuevaPass />
			{/if}
		</div>
	</div>
</div>
