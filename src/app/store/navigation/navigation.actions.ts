import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const NavigationActions = createActionGroup({
	source: 'Navigation',
	events: {
		'Open Navigation': emptyProps(),
		'Close Navigation': emptyProps(),
		'Toggle Navigation': emptyProps(),
		'Set Navigation State': props<{ isOpen: boolean }>(),
	},
});
