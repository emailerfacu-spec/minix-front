export interface Post {
	_id: string;
	authorId: string;
	content: string;
	imageUrl?: string;
	parentPostId?: string;
	likesCount: number;
	repliesCount: number;
	createdAt: Date;
	updatedAt?: Date;
	isEdited: boolean;
	visibility: string;
	hashtags?: string[];
}
