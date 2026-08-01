import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  // Movies

  getMovies(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/movie/now_playing`).pipe(
      map((response: any) => this.extractResults(response))
    );
  }

  getMovieDetails(id: number) {
    return this.http.get(`${this.baseUrl}/movie/${id}`);
  }

  getGenre(id: number) {
    return this.http.get(
      `${this.baseUrl}/discover/movie?with_genres=${id}`
    );
  }

  getGenreList(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/genre/movie/list`).pipe(
      map((response: any) => this.extractResults(response, 'genres'))
    );
  }

  getPopularMovies(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/movie/popular`).pipe(
      map((response: any) => this.extractResults(response))
    );
  }

  getTopRatedMovies(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/movie/top_rated`).pipe(
      map((response: any) => this.extractResults(response))
    );
  }

  // TV Shows

  getTVShows(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/tv/popular`).pipe(
      map((response: any) => this.extractResults(response))
    );
  }

  getTVShowDetails(id: number) {
    return this.http.get(`${this.baseUrl}/tv/${id}`);
  }

  // Search

  searchMovieByName(movieName: string): Observable<any[]> {
    return this.http.get<any>(
      `${this.baseUrl}/search/movie?query=${encodeURIComponent(movieName)}`
    ).pipe(
      map((response: any) => this.extractResults(response))
    );
  }

  // Filter by Genre

  filterByGenre(id: number): Observable<any[]> {
    return this.http.get<any>(
      `${this.baseUrl}/discover/movie?with_genres=${id}`
    ).pipe(
      map((response: any) => this.extractResults(response))
    );
  }

  private extractResults(response: any, key: string = 'results'): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (response && typeof response === 'object') {
      if (Array.isArray(response[key])) {
        return response[key];
      }

      if (Array.isArray(response.results)) {
        return response.results;
      }
    }

    return [];
  }

}