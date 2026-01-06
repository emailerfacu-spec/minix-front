import type { RequestHandler } from './$types';
import { obtenerPostPorId } from '@/hooks/obtenerPostPorId';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: RequestHandler = async ({ params, fetch, request }) => {
	if (!params.idpost) {
		return new Response('ID no proporcionado', { status: 400 });
	}

	const post = await obtenerPostPorId(params.idpost, fetch);

	if (typeof post === 'string' || post === null) {
		return new Response('Post no encontrado', { status: 404 });
	}

	const element = {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%',
				backgroundColor: '#000000' // Fondo negro puro de X
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							width: '560px',
							backgroundColor: '#000000',
							padding: '24px',
							borderRadius: '32px',
							border: '1px solid #2F3336' // Borde sutil
						},
						children: [
							// Header con avatar y usuario
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										alignItems: 'center',
										gap: '12px',
										marginBottom: '12px'
									},
									children: [
										post.authorImageUrl
											? {
													type: 'img',
													props: {
														src: post.authorImageUrl,
														width: 48,
														height: 48,
														style: {
															width: '48px',
															height: '48px',
															borderRadius: '50%',
															objectFit: 'cover'
														}
													}
												}
											: {
													type: 'div',
													props: {
														style: {
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															width: '48px',
															height: '48px',
															borderRadius: '50%',
															backgroundColor: '#1D9BF0', // Azul de X
															color: '#FFFFFF',
															fontSize: '20px',
															fontWeight: 700
														},
														children: post.authorName?.charAt(0).toUpperCase() || '?'
													}
												},
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													flexDirection: 'column',
													gap: '2px'
												},
												children: [
													{
														type: 'span',
														props: {
															style: {
																fontSize: '15px',
																fontWeight: 700,
																color: '#E7E9EA'
															},
															children: post.authorDisplayName || post.authorName
														}
													},
													{
														type: 'span',
														props: {
															style: {
																fontSize: '15px',
																color: '#71767B'
															},
															children: `@${post.authorName}`
														}
													}
												]
											}
										},
										// Espaciador
										{
											type: 'div',
											props: {
												style: {
													flex: 1
												}
											}
										},
										// Logo de X
										{
											type: 'img',
											props: {
												height: 32,
												width: 32,
												src: `${new URL(request.url).origin}/x.png`,
												style: {
													width: '32px',
													height: '32px',
													borderRadius: '8px'
												}
											}
										}
									]
								}
							},
							// Contenido del post
							{
								type: 'div',
								props: {
									style: {
										fontSize: '23px',
										lineHeight: '32px',
										color: '#E7E9EA',
										marginBottom: '12px',
										whiteSpace: 'pre-wrap',
										wordWrap: 'break-word'
									},
									children: post.content
								}
							},
							// Footer con fecha
							{
								type: 'div',
								props: {
									style: {
										fontSize: '15px',
										color: '#71767B',
										paddingTop: '12px',
										borderTop: '1px solid #2F3336'
									},
									children: new Date(post.createdAt).toLocaleString('es-ES', {
										hour: 'numeric',
										minute: '2-digit',
										hour12: true,
										day: 'numeric',
										month: 'short',
										year: 'numeric'
									})
								}
							}
						]
					}
				}
			]
		}
	};

	const fontPath = join(process.cwd(), 'src', 'lib', 'assets', 'fonts', 'Ubuntu-Regular.ttf');
	const fontData = readFileSync(fontPath);

	const svg = await satori(element, {
		width: 600,
		height: 300,
		fonts: [
			{
				name: 'Inter',
				data: fontData,
				weight: 400,
				style: 'normal'
			}
		]
	});

	// Convertir SVG a PNG
	const resvg = new Resvg(svg);
	const pngData = resvg.render();
	const pngBuffer = pngData.asPng();

	return new Response(new Uint8Array(pngBuffer), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
