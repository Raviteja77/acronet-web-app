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

@NgModule({
  declarations: [
    HeaderComponent,
    SidePanelCardComponent,
    HomeDataViewComponent,
  ],
  imports: [
    CommonModule,
    MenubarModule,
    CardModule,
    ButtonModule,
    ListboxModule,
    FormsModule,
    DataViewModule,
  ],
  exports: [
    HeaderComponent,
    SidePanelCardComponent,
    HomeDataViewComponent
  ]
})
export class SharedModule { }
