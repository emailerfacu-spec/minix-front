export interface Post {
	_id: string;
	id: string;
	authorId: string;
	authorDisplayName: string;
	authorImageUrl: string;
	authorName: string;
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
	isLiked: boolean;
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
	isAdmin: boolean;
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

export interface PostResponseDto {
	id: string;
	authorId: string;
	authorImageUrl: string?;
	authorDisplayName: string;
	authorName: string;
	content: string;
	imageUrl: string?;
	parentPostId: string?;
	likesCount: number;
	repliesCount: number;
	createdAt: string;
	updatedAt: string?;
	isEdited: boolean;
	visibility: string;
	hashtags: string[]?;
}

export interface UserResponseDto {
	id: string;
	username: string;
	displayName: string;
	email: string;
	bio: string;
	profileImageUrl: string;
	followersCount: number;
	followingCount: number;
	createdAt: string;
}
