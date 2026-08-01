import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies: any[] = [];
  popularMovies: any[] = [];
  topRatedMovies: any[] = [];
  genres: any = {};
  tvShows: any[] = [];
  searchResults: any[] = [];
  searchInitiated: boolean = false;
  searchControl = new FormControl('');

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.getMovies();
    this.getPopularMovies();
    this.getTopRatedMovies();
    this.getGenres();
    this.getTVShows();
  }

  //movies
  getMovies() {
    this.dataService.getMovies().subscribe((data: any[]) => {
      this.movies = data;
    });
  }

  getPopularMovies() {
    this.dataService.getPopularMovies().subscribe((data: any[]) => {
      this.popularMovies = data;
    });
  }

  getTopRatedMovies() {
    this.dataService.getTopRatedMovies().subscribe((data: any[]) => {
      this.topRatedMovies = data;
    });
  }

  getGenres() {
    this.dataService.getGenreList().subscribe((data: any[]) => {
      this.genres = data.reduce((acc: any, genre: any) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
    });
  }

  getSlicedMovies() {
    return this.getSlicedItems(this.movies);
  }

  getSlicedPopularMovies() {
    return this.getSlicedItems(this.popularMovies);
  }

  private getSlicedItems(items: any[] = []): any[] {
    const safeItems = Array.isArray(items) ? items : [];
    return this.shuffleArray([...safeItems]).slice(0, 6);
  }

  private shuffleArray(array: any[]): any[] {
    const clonedArray = [...array];
    for (let i = clonedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clonedArray[i], clonedArray[j]] = [clonedArray[j], clonedArray[i]];
    }
    return clonedArray;
  }

  getSlicedTopRatedMovies() {
    return this.getSlicedItems(this.topRatedMovies);
  }

  getGenreNames(genreIds: number[]): string {
    return genreIds.map(id => this.genres[id]).join(', ');
  }

  //tvshows
  getTVShows() {
    this.dataService.getTVShows().subscribe((data: any[]) => {
      this.tvShows = data;
    });
  }

  getSlicedTVShows() {
    return this.getSlicedItems(this.tvShows);
  }

  // search
  searchMovie() {
    this.searchInitiated = true;
    const movieName = this.searchControl.value;
    if (movieName) {
      this.dataService.searchMovieByName(movieName).subscribe((data: any[]) => {
        this.searchResults = data;
      });
    }
  }

  // Method to handle keyup events
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchMovie();
    }
  }

  //open movie details
  openMovieDetails(movieId: number) {
    this.router.navigate(['/player', movieId]);
  }

  //open tvshow details
  openTVShowDetails(id: number) {
    this.router.navigate(['/series-player', id]);
  }
}
