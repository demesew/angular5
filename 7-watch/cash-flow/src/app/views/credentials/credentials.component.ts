import { Component, OnInit } from "@angular/core";
import { CredentialsService } from "./credentials.service";
import { BusService } from "../../lib/bus.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "cf-login",
  template: `
  <h2>{{pageData.title}}</h2>
  <form class="container">
    <label for="email">Email</label>
    <input name="email"
      [(ngModel)]="pageData.credential.email"
      type="email"/>
    <label for="password">Password</label>
    <input name="password"
      [(ngModel)]="pageData.credential.password"
      type="password"/>
    <button (click)="sendCredential()">{{ pageData.title }}</button>
    <a [routerLink]="['..',pageData.alternate | lowercase]">{{ pageData.alternate }}</a>
  </form>
  <i>{{ errorMessage }}</i>
  `,
  styles: []
})
export class CredentialsComponent implements OnInit {
  public pageData: any;
  public errorMessage = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private busService: BusService,
    private credentialsService: CredentialsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtainPageDataFromRoute();
  }

  private obtainPageDataFromRoute() {
    this.pageData = this.activatedRoute.snapshot.data;
  }

  public sendCredential() {
    this.errorMessage = "";
    this.credentialsService
      .sendCredential(this.pageData.credential, this.pageData.title)
      .subscribe(
        data => this.acceptedCredentials(data),
        error => this.invalidCredentials()
      );
  }

  private acceptedCredentials(token) {
    this.busService.emitUserToken(token);
    this.router.navigateByUrl("/");
  }

  private invalidCredentials() {
    this.busService.emitUserToken(null);
    this.errorMessage = "Invalid Credentials";
  }
}
