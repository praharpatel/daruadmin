import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '@core/services/user.service';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit {
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UsersService,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.token = params.token;
    });
  }

  submitted = false;
  activeForm: FormGroup;
  // convenience getter for easy access to form fields
  get f() { return this.activeForm.controls; }
  // set the currenr year
  year: number = new Date().getFullYear();

  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      680: {
        items: 1
      },
    }
  };

  ngOnInit(): void {
    this.activeForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      passwordTwo: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.activeForm.invalid) {
      return;
    } else {
      if (this.f.password.value !== this.f.passwordTwo.value) {
        basicAlert(TYPE_ALERT.WARNING, 'Las contrasenas no coinciden. Asegurate que las contrasenas sean iguales.');
        return;
      }
      // Todo validado, enviar a la api de graphql
      // servicio => active
      this.userService.active(this.token, this.f.password.value).subscribe(
        result => {
          if (result.status) {
            // Redireccionar a login
            this.router.navigate(['/auth/login']);
            basicAlert(TYPE_ALERT.SUCCESS, result.message);
            return;
          }
          basicAlert(TYPE_ALERT.WARNING, result.message);
        }
      );
    }
  }
}
