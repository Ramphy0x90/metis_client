import { Role } from './identity/roles';

export type NavBarItem = {
	label: string;
	path: string;
	icon: string;
	visibility: Role[];
};
