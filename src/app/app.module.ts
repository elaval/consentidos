import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';

import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { DataService } from './services/data.service';
import { CompetitorComponent } from './vis/competitor/competitor.component';
import { SchoolsInstitutionsComponent } from './vis/schools-institutions/schools-institutions.component';
import { InstitutionProfileComponent } from './info-widgets/institution-profile/institution-profile.component';
import { MainSelectorComponent } from './scope-selector/main-selector/main-selector.component';
import { NotAuthComponent } from './not-auth/not-auth.component';
import { ScopeService } from './services/scope.service';
import { GlobalPanelComponent } from './scope-panels/global-panel/global-panel.component';
import { TipoInstitucionPanelComponent } from './scope-panels/tipo-institucion-panel/tipo-institucion-panel.component';
import { InstitucionPanelComponent } from './scope-panels/institucion-panel/institucion-panel.component';
import { CarreraPanelComponent } from './scope-panels/carrera-panel/carrera-panel.component';
import { MiniquadComponent } from './vis/miniquad/miniquad.component';
import { EntityCardComponent } from './vis/entity-card/entity-card.component';
import { UtilService } from './services/util.service';
import { UnitsStorageService } from './services/units-storage.service';
import { SourceSchoolsComponent } from './vis/source-schools/source-schools.component';
import { SchoolCardComponent } from './vis/school-card/school-card.component';
import { CompetitorsSameCarreraComponent } from './vis/competitors-same-carrera/competitors-same-carrera.component';
import { PerfilCarerasComponent } from './vis/perfil-careras/perfil-careras.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CallbackComponent,
    CompetitorComponent,
    SchoolsInstitutionsComponent,
    InstitutionProfileComponent,
    MainSelectorComponent,
    NotAuthComponent,
    GlobalPanelComponent,
    TipoInstitucionPanelComponent,
    InstitucionPanelComponent,
    CarreraPanelComponent,
    MiniquadComponent,
    EntityCardComponent,
    SourceSchoolsComponent,
    SchoolCardComponent,
    CompetitorsSameCarreraComponent,
    PerfilCarerasComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule, 
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    AuthService,
    DataService,
    ScopeService,
    UtilService,
    UnitsStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
