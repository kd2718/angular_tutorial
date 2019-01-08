import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
    debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';

import { HeroService } from '../hero.service';

@Component({
    selector: 'app-hero-search',
    templateUrl: './hero-search.component.html',
    styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {

    heroes$: Observable<Hero[]>;

    private searchTerms = new Subject<string>();



    constructor(private heroService: HeroService) { }

    // push a search term into the observable stream.

    search(term: string): void {
        this.searchTerms.next(term);
    }

    ngOnInit() {
        this.heroes$ = this.searchTerms.pipe(
            // wait 300ms after each keystroke
            debounceTime(300),

            // ignore new tem if same as previous term
            distinctUntilChanged(),

            // switch to new search observalbe each time the term chagnes
            switchMap((term: string) => this.heroService.searchHeroes(term))
        );
    }

}
