export interface AvatarUrls {
	'48x48': string;
	'24x24': string;
	'16x16': string;
	'32x32': string;
}

export interface Author {
	self: string;
	name: string;
	key: string;
	emailAddress: string;
	avatarUrls: AvatarUrls;
	displayName: string;
	active: boolean;
	timeZone: string;
}

export interface UpdateAuthor {
	self: string;
	name: string;
	key: string;
	emailAddress: string;
	avatarUrls: AvatarUrls;
	displayName: string;
	active: boolean;
	timeZone: string;
}

export interface AddCommentJiraIssueResponse {
	self: string;
	id: string;
	author: Author;
	body: string;
	updateAuthor: UpdateAuthor;
	created: Date;
	updated: Date;
}
