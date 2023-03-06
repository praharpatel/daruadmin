import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '@core/interfaces/user.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';

@Component({
  selector: 'app-capture-user',
  templateUrl: './capture-user.component.html',
  styleUrls: ['./capture-user.component.scss']
})
export class CaptureUserComponent implements OnInit {

  titulo = 'Capturando usuario';
  @Input() user: IUser = {
    id: '',
    name: '',
    lastname: '',
    email: '',
    password: '',
    role: 'VENTAS',
    active: false
  };
  @Output() userChange = new EventEmitter<IUser>();
  submitted = false;
  @ViewChild('content') content: any;
  @Output() datosEnviar: FormData = new FormData();
  editMode = false;
  onlyView = false;
  roleView: string;
  estatus: string;

  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.roleView = 'VENTA';
    this.estatus = 'Inactivo';
  }

  onSetCatalog(user: IUser) {
    // this.captureForm.controls.email.setValue(user.email);
    // if (!this.editMode) {
    //   this.captureForm.controls.password.setValue(user.password);
    // }
    // this.captureForm.controls.name.setValue(user.name);
    // this.captureForm.controls.lastname.setValue(user.lastname);
    // this.captureForm.controls.role.setValue(user.role);
    // this.captureForm.controls.active.setValue(user.active);
  }

  onSubmit() {
    this.submitted = true;
    // if (this.captureForm.invalid) {
    //   basicAlert(TYPE_ALERT.WARNING, 'Verificar campos');
    //   return;
    // }
    this.onSetCatalog(this.user);
    this.userChange.emit(this.user);
  }

  onOpenModal(user: IUser, editMode: boolean = false, onlyView: boolean = false) {
    this.user = user;
    if (!editMode) {
      this.user.role = 'VENTA';
    }
    this.editMode = editMode;
    this.onlyView = onlyView;
    // Cambia el título de acuerdo a si es solo vista, edición o nuevo.
    this.titulo = this.editMode ? onlyView ? 'Consultar' : 'Modificar' : 'Agregar';
    // Campos para editar
    const valorEditar = this.editMode ? this.user.active ? 'Activo' : 'Inactivo' : 'Activo';
    // this.captureForm.controls.email.setValue(this.user.email);
    // this.captureForm.controls.estatus.setValue(valorEditar);
    // this.captureForm.controls.name.setValue(this.user.name);
    // this.captureForm.controls.lastname.setValue(this.user.lastname);
    // this.captureForm.controls.role.setValue(this.user.role);
    console.log('this.user.role: ', this.user.role);
    this.roleView = this.asignaRolView(this.user.role);
    this.modal.open(this.content, { size: 'lg' });
  }

  onCloseModal() {
    this.modal.dismissAll();
  }

  asignRol(role: string, roleView: string) {
    this.user.role = role;
    // this.captureForm.controls.role.setValue(role);
    this.roleView = roleView;
  }

  asignaRolView(role: string) {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'VENTA':
        return 'Ventas';
      default:
        return '';
    }
  }
}
