export enum EntityFieldVisiblity {
	TABLE = 'table',
	FORM = 'form',
	ALL = 'all',
}

export enum EntityFieldSize {
	SM = 'small',
	MD = 'medium',
	LG = 'large',
	AUTO = 'auto',
}

export enum EntityFieldType {
	TEXT = 'text',
	NUMBER = 'number',
	EMAIL = 'email',
	TEXTAREA = 'textarea',
}

export type EntityField = {
	key: string;
	label: string;
	type: EntityFieldType;
	size: EntityFieldSize;
	visibility: EntityFieldVisiblity;
	required: boolean;
	placeholder?: string;
};
