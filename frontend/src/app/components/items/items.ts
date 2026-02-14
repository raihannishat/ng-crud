import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './items.html',
  styleUrl: './items.css'
})
export class ItemsComponent implements OnInit {
  private readonly itemService = inject(ItemService);
  private readonly fb = inject(FormBuilder);

  items = signal<Item[]>([]);
  editingId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    description: ['']
  });

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.error.set(null);
    this.itemService.getItems().subscribe({
      next: (data: Item[]) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: (err: { message?: string }) => {
        this.error.set(err.message || 'Failed to load items');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const id = this.editingId();
    const value = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);

    if (id !== null) {
      this.itemService.updateItem(id, { id, name: value.name, description: value.description || null }).subscribe({
        next: () => {
          this.loadItems();
          this.cancelEdit();
        },
        error: (err: HttpErrorResponse) => {
          this.loadItems();
          this.cancelEdit();
          this.error.set(err.status === 404 ? 'Item was not found (may have been deleted). List refreshed.' : (err.message || 'Update failed'));
          this.loading.set(false);
        }
      });
    } else {
      this.itemService.createItem({ name: value.name, description: value.description || null }).subscribe({
        next: () => {
          this.loadItems();
          this.form.reset({ name: '', description: '' });
        },
        error: (err: { message?: string }) => {
          this.error.set(err.message || 'Create failed');
          this.loading.set(false);
        }
      });
    }
  }

  editItem(item: Item): void {
    this.editingId.set(item.id);
    this.form.patchValue({ name: item.name, description: item.description ?? '' });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', description: '' });
  }

  deleteItem(item: Item): void {
    if (!confirm(`Delete "${item.name}"?`)) return;
    this.loading.set(true);
    this.error.set(null);
    this.itemService.deleteItem(item.id).subscribe({
      next: () => this.loadItems(),
      error: (err: HttpErrorResponse) => {
        this.loadItems();
        this.error.set(err.status === 404 ? 'Item was already deleted. List refreshed.' : (err.message || 'Delete failed'));
        this.loading.set(false);
      }
    });
  }
}
