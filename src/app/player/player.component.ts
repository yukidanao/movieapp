import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  movie: any;
  genres: any = {};
  movieUrl: SafeResourceUrl | null = null; 
  popularMovies: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private sanitizer: DomSanitizer, 
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const movieId = paramMap.get('id');
      if (movieId) {
        this.loadMovieDetails(Number(movieId));
      }
    });

    this.getPopularMovies();
    this.getGenres();
  }

  loadMovieDetails(id: number) {
    this.getMovieDetails(id);
    this.movieUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://vidsrc-embed.ru/embed/movie/${id}`
    );
  }

  getMovieDetails(id: number) {
    this.dataService.getMovieDetails(id).subscribe((data: any) => {
      this.movie = data;
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

  getGenreNames(genres: { id: number; name: string }[]): string {
    return genres.map((genre) => genre.name).join(', ');
  }

  getSlicedPopularMovies() {
    return this.shuffleArray(this.popularMovies).slice(0, 6);
  }

  getPopularMovies() {
    this.dataService.getPopularMovies().subscribe((data: any) => {
      this.popularMovies = data;
    });
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  openMovieDetails(movieId: number) {
    this.router.navigate(['/player', movieId]);
  }
}
