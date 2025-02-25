import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from '../service/registration.service';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  
  registerForm !: FormGroup;

  fb = inject(FormBuilder);

  service = inject(RegistrationService);

  pattern = "^[a-zA-Z0-9]+@[a-z]+\\.[a-z]{2,}$";

  users: any[] = [];


  ngOnInit(): void {
    
    this.initForm();
    this.copy();
  }

  initForm(){
    this.registerForm = this.fb.group({
      personalInfo: this.fb.group({
        username: ['', [ Validators.required,Validators.minLength(5),] ],
        email: ['', [ Validators.required, Validators.email, Validators.pattern(this.pattern)] ],
        password: ['', [ Validators.required, Validators.minLength(5)] ],
        phonenumber: ['', [ Validators.required]]
      }),

      deliveryAddress: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipcode: ['']
      }),
      
      billingAddress: this.fb.group({
        street: [''],
        city: [''],
        state:[''],
        zipcode: ['']
      }),

      sameAsDelivery: [false]
    });
  }

  copy(){
    const address = this.registerForm.get('sameAsDelivery');
    if(address){
      address.valueChanges.pipe( distinctUntilChanged(), debounceTime(300)).subscribe(checked => {
        if (checked) {
          const deliveryAddress = this.registerForm.get('deliveryAddress')?.value;
          this.registerForm.get('billingAddress')?.patchValue(deliveryAddress);
        }
      });
    }
  }

  register(){
    if (this.registerForm.valid) {
      this.service.registerUser(this.registerForm.value).subscribe({
        next: (res: any) => { alert("Registered Successfully."), console.log('Registration successful', res) },
        error: (err: any) => { alert("Registration Failed."), console.error('Registration failed', err)}
      });
    }
    this.registerForm.reset();
  }

  getUsers(){
    this.service.getUsers().subscribe({
      next:(response) => {
        //console.log(response);
        this.users = response;
      },
      error:(error)=>{
        console.log("error",error);
      }
    })
  }
}
