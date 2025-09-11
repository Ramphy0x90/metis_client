import { Component, Signal, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation-component/navigation-component';
import { IdentityStore } from './store/identity/identity.store';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header-component/header-component';

@Component({
	selector: 'app-root',
	imports: [CommonModule, RouterOutlet, NavigationComponent, HeaderComponent],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	protected readonly title = signal('Metis');

	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	readonly isUserAuthenticated: Signal<boolean> = this.identityStore.isAuthenticated;
}
