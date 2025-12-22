export function load({ url }) {
	return {
		message: url.searchParams.get('msg')
	};
}
