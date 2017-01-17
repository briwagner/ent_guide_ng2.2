import { Injectable } from '@angular/core';

import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Movie } from '../models/movie';

import { Api_Key } from '../api_key';

@Injectable()
export class MoviesService {

  private url = 'http://data.tmsapi.com/v1.1/movies/showings';
  private api_key = Api_Key;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  getMovies(userZip) {
    let zipCode = userZip > 1 ? userZip : '20002';
    let params : URLSearchParams = new URLSearchParams();
    params.set('startDate', formatDate());
    params.set('zip', zipCode);
    params.set("api_key", this.api_key);
    let movies = this.http.get(this.url, {headers: this.getHeaders(),
                                          search: params})
                          .map(this.convertMovies)
    return movies;
  }

  convertMovies(response: Response) {
    if (response.json()){
      return response.json().map(toMovie);
    } else {
      return false;
    }
  }

  getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }

}

function toMovie(d) {
  let movie = <Movie>({
    title: d.title,
    genres: d.genres,
    description: d.shortDescription,
    summary: d.longDescription,
    qualityRating: d.qualityRating ? d.qualityRating.value : "-1",
    cast: d.topCast,
    selected: false,
    showtimes: sortShowtimes(d.showtimes)
  });
  return movie;
}

function joinArray(arr) {
  if (typeof arr == 'object' && arr.length > 0) {
    return arr.join(", ");
  } else {
    return arr;
  }
}

function sortShowtimes(showtimes) {
  let timeObj = {};
  let arr = [];
  for (let i = 0; i < showtimes.length; i++) {
    let id = showtimes[i].theatre.id;
    if (timeObj[id] && showtimes[i].dateTime) {
      timeObj[id].times.push(showtimes[i].dateTime);
    } else {
      timeObj[id] = {
        'name': showtimes[i].theatre.name,
        'times': [showtimes[i].dateTime]
      };
    }
  }
  for (var prop in timeObj) {
    arr.push(timeObj[prop]);
  }
  return arr;
}

function formatDate() {
  let date = new Date();
  let arr = [date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)];
  return arr.join("-");
}