import { Injectable } from '@angular/core';

import {Hero} from './hero';
import {HEROES} from './mock-heroes';

import {MessageService} from './message.service';

import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  getHeroes(): Observable<Hero[]> {
    // TODO: send message after getting heroes
    this.messageService.add('HeroService: Fetched Heroes');
    return of(HEROES);
  }

  constructor(private messageService: MessageService) { }
}
