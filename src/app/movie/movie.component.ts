import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent implements OnInit {
  movies: any[] = [];
  genres: any = {};
  currentPage: number = 1;
  itemsPerPage: number = 12;
  selectedGenre: number | null = null;
  imageurl: string = 'https://image.tmdb.org/t/p/w500/';

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedGenre = params['genre'] ? +params['genre'] : null;
      this.filterMoviesByGenre();
    });
    this.getGenres();
  }

  getMovies() {
    this.dataService.getMovies().subscribe((data: any) => {
      this.movies = data;
    });
  }

  getGenres() {
    this.dataService.getGenreList().subscribe((data: any) => {
      this.genres = data.reduce((acc: any, genre: any) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
    });
  }

  getGenreNames(genreIds: number[]): string {
    return genreIds.map(id => this.genres[id]).join(', ');
  }

  openMovieDetails(movieId: number) {
    this.router.navigate(['/player', movieId]);
  }

  filterMoviesByGenre() {
    if (this.selectedGenre) {
      this.dataService.filterByGenre(this.selectedGenre).subscribe((data: any) => {
        this.movies = data;
      });
    } else {
      this.getMovies();
    }
  }
}