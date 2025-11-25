export interface Post {
	_id: string;
	authorId: string;
	content: string;
	imageUrl?: string;
	parentPostId?: string;
	likesCount: number;
	repliesCount: number;
	createdAt: string;
	updatedAt?: Date;
	isEdited: boolean;
	visibility: string;
	hashtags?: string[];
}

export interface User {
	_id: string;
	displayName: string;
	username: string;
	email: string;
	passwordHash: string;
	bio?: string;
	profileImageUrl?: string;
	createdAt: Date;
	followersCount: number;
	followingCount: number;
	refreshTokens: RefreshToken[];
}

export interface Sesion {
	accessToken: string?;
	message: string;
	url: string;
	displayName: string;
	username: string;
}

export interface LoginDto {
	username: string?;
	password: string?;
}

export interface RegisterDto {
	username: string?;
	email: string?;
	password: string?;
	displayName: string?;
}

export interface CreatePostDto {
	content: string;
	imageUrl: string?;
	parentPostId: string?;
}
