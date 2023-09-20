import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { RegisterComponent } from './components/register/register.component';
import {RouterModule, Routes} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ComponentPreloadingStrategy} from "./components/strategies/component-preloading-strategy";
import {AuthInterceptorService} from "./services/auth-interceptor.service";
import { AboutUsComponent } from './components/about-us/about-us.component';
import {AuthGuard} from "./guards/auth.guard";
import { LandingComponent } from './components/landing/landing.component';
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {path: 'login', component: LoginComponent, data: { preload: true }},
  {path: 'home', component: LandingComponent, data: { preload: true }},
  {path: 'register', component: RegisterComponent, data: { preload: true }},
  {path: 'about-us', component: AboutUsComponent, data: { preload: true }},
  {path: 'portfolio', canActivate: [AuthGuard], component: PortfolioComponent},
  {path: '', component: PortfolioComponent, pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    PortfolioComponent,
    RegisterComponent,
    AboutUsComponent,
    LandingComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: ComponentPreloadingStrategy,
    }),
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    ComponentPreloadingStrategy
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
