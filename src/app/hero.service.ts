import { Injectable } from '@angular/core';

import { Hero } from './hero';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MessageService } from './message.service';

import { Observable, of } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class HeroService {

    private heroesUrl = 'api/heroes'; // Url to web API 

    getHeroes(): Observable<Hero[]> {
        // TODO: send message after getting heroes
        this.messageService.add('HeroService: Fetched Heroes');
        return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
                tap(_ => this.log('fetch heroes')),
                tap(heroes => this.log(`found ${heroes.length}`)),
                catchError(this.handleError('getHeroes', []))
            );
    }

    /** Get hero by id. Will 404 if id not found */
    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
            tap(_ => this.log(`fetched hero id=${id}`)),
            tap(hero => this.log(`getting info for hero: ${hero.name}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    /** PUT: update the hero on the server */
    updateHero(hero: Hero): Observable<any> {
        return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
            tap(_ => this.log(`updated hero id=${hero.id}`)),
            catchError(this.handleError<any>('updateHero'))
        );
    }

    /** POST: add a new hero to the server */
    addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
            tap((newhero: Hero) => this.log(`added hero with id=${newhero.id}`)),
            catchError(this.handleError<Hero>('addHero'))
        );
    }

    /** DELETE: delete the hero from the server */
    deleteHero(hero: Hero | number): Observable<Hero> {
        const id = typeof hero === 'number' ? hero : hero.id;
        const url = `${this.heroesUrl}/${id}`;

        return this.http.delete<Hero>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted hero id = ${id}`)),
            catchError(this.handleError<Hero>('deleteHero'))
        );
    }

    /** Log a HeroService message with the Message Service */
    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // todo : send error to remote logging
            console.error(error); // log to console for now

            // TODO: bettter job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // let app keep running by returning an empy result
            return of(result as T);
        };
    }

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }
}
