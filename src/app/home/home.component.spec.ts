import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DataService } from '../data.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj<DataService>('DataService', [
      'getMovies',
      'getPopularMovies',
      'getTopRatedMovies',
      'getGenreList',
      'getTVShows',
      'searchMovieByName'
    ]);

    dataServiceSpy.getMovies.and.returnValue(of({ results: [{ id: 1, title: 'A' }] }));
    dataServiceSpy.getPopularMovies.and.returnValue(of({ results: [{ id: 2, title: 'B' }] }));
    dataServiceSpy.getTopRatedMovies.and.returnValue(of({ results: [{ id: 3, title: 'C' }] }));
    dataServiceSpy.getGenreList.and.returnValue(of({ genres: [{ id: 1, name: 'Drama' }] }));
    dataServiceSpy.getTVShows.and.returnValue(of({ results: [{ id: 4, name: 'Show' }] }));
    dataServiceSpy.searchMovieByName.and.returnValue(of({ results: [] }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [HomeComponent],
      providers: [{ provide: DataService, useValue: dataServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should normalize object payloads into arrays for slicing', () => {
    component.movies = { results: [{ id: 1, title: 'A' }, { id: 2, title: 'B' }] } as any;

    const sliced = component.getSlicedMovies();

    expect(Array.isArray(sliced)).toBeTrue();
    expect(sliced.length).toBe(2);
  });
});
