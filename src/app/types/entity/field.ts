import { Signal } from '@angular/core';

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
	PASSWORD = 'password',
	LOOKUP = 'lookup',
	DROPDOWN = 'dropdown',
}

export type EntityField = {
	key: string;
	label: string;
	type: EntityFieldType;
	size: EntityFieldSize;
	visibility: EntityFieldVisiblity;
	placeholder?: string;
	lookupDataID?: string;
	dropdownDataSourceID?: string;
	dropdownDataLabelID?: string;
};
