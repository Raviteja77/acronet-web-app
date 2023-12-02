import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MenubarModule } from 'primeng/menubar';
import { SidePanelCardComponent } from './side-panel-card/side-panel-card.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { HomeDataViewComponent } from './home-data-view/home-data-view.component';
import { DataViewModule } from 'primeng/dataview';
import { NotFoundComponent } from './not-found/not-found.component';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    HeaderComponent,
    SidePanelCardComponent,
    HomeDataViewComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    MenubarModule,
    CardModule,
    ButtonModule,
    ListboxModule,
    FormsModule,
    DataViewModule,
    AvatarModule,
    OverlayPanelModule,
    ConfirmDialogModule
  ],
  exports: [
    HeaderComponent,
    SidePanelCardComponent,
    HomeDataViewComponent,
    NotFoundComponent
  ]
})
export class SharedModule { }
