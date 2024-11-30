import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any; // Importar Bootstrap JS

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  users: any[] = [];
  newUser: any = { name: '', email: '' };
  isEditing: boolean = false;
  editingUserId: number | null = null;
  isModalOpen: boolean = false;

  modal: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(document.getElementById('userModal')!); 
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error('Erro ao carregar usuários', err),
    });
  }

  openModal() {
    this.newUser = { name: '', email: '' };
    this.isEditing = false;
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email) return;

    this.userService.createUser(this.newUser).subscribe({
      next: (data) => {
        this.users.push(data);
        this.closeModal(); // Fecha o modal após criação
      },
      error: (err) => console.error('Erro ao criar usuário', err),
    });
  }

  editUser(user: any) {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.newUser = { name: user.name, email: user.email };
    this.modal.show(); // Abre o modal em modo de edição
  }

  updateUser() {
    if (!this.newUser.name || !this.newUser.email) return;

    if (this.editingUserId) {
      this.userService.updateUser(this.editingUserId, this.newUser).subscribe({
        next: (data) => {
          const index = this.users.findIndex((user) => user.id === this.editingUserId);
          this.users[index] = data;
          this.closeModal();
        },
        error: (err) => console.error('Erro ao atualizar usuário', err),
      });
    }
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== id);
      },
      error: (err) => console.error('Erro ao deletar usuário', err),
    });
  }

  resetForm() {
    this.isEditing = false;
    this.editingUserId = null;
    this.newUser = { name: '', email: '' };
  }
}