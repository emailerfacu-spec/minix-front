<script>
	import BreadcrumbItem from '@/components/ui/breadcrumb/breadcrumb-item.svelte';
	import BreadcrumbList from '@/components/ui/breadcrumb/breadcrumb-list.svelte';
	import BreadcrumbSeparator from '@/components/ui/breadcrumb/breadcrumb-separator.svelte';
	import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb.svelte';

	let { estado } = $props();
</script>

<div class="flex w-full justify-center">
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<p class={`select-none ${estado === 'email' ? 'font-bold text-white' : ''}`}>
					Ingrese Email
				</p>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<p class={`select-none ${estado === 'otp' ? 'font-bold text-white' : ''}`}>Ingresar OTP</p>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<p class={`select-none ${estado === 'nuevapass' ? 'font-bold text-white' : ''}`}>
					Nueva Contraseña
				</p>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</div>
