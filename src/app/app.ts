import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation-component/navigation-component';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from './store/identity';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-root',
	imports: [CommonModule, RouterOutlet, NavigationComponent],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	protected readonly title = signal('Metis');

	constructor(private store: Store) {}

	get isUserAuthenticated(): Observable<boolean> {
		return this.store.select(selectIsAuthenticated);
	}
}
