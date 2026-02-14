import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item';

const API_URL = '/api/items';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(API_URL);
  }

  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${API_URL}/${id}`);
  }

  createItem(item: Omit<Item, 'id'>): Observable<Item> {
    return this.http.post<Item>(API_URL, item);
  }

  updateItem(id: number, item: Item): Observable<void> {
    return this.http.put<void>(`${API_URL}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
