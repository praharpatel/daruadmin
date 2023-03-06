import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { UsersService } from '@core/services/user.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UsersService,
    private router: Router
  ) { }

  submitted = false;
  recoverForm: FormGroup;
  // convenience getter for easy access to form fields
  get f() { return this.recoverForm.controls; }
  // set the currenr year
  year: number = new Date().getFullYear();

  error = '';
  success = '';
  loading = false;

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
    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.recoverForm.invalid) {
      return;
    }
    // this.userService.resetPassword(this.f.email.value)
    //   .catch(error => {
    //     this.error = error ? error : '';
    //   });
  }
}
