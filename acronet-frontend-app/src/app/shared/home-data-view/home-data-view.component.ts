import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { Acronym } from 'src/app/interfaces/acronym.interface';
import { EditAcronymComponent } from 'src/app/modules/my-acronyms/edit-acronym/edit-acronym.component';
import { AcronymsService } from 'src/app/services/acronyms/acronyms.service';

@Component({
  selector: 'app-home-data-view',
  templateUrl: './home-data-view.component.html',
  styleUrls: ['./home-data-view.component.scss'],
})
export class HomeDataViewComponent implements OnChanges, OnInit {
  @Input() searchedAcronym: string = '';
  filteredAcronyms!: any;
  acronyms: Acronym[] = [];
  ref!: DynamicDialogRef;

  @ViewChild('dv', {static: false}) dataView!: DataView;
  userRole: string = '';

  constructor(private acronymsService: AcronymsService, 
    public authService: AuthService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService) {}

  getAcronyms() {
    return this.filteredAcronyms? this.filteredAcronyms != 'empty'? [this.filteredAcronyms]: []: this.acronyms;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes['searchedAcronym'].currentValue;
    if(currentValue) {
      this.acronyms.filter(el => {
        if(el.acronym_name?.toLowerCase()?.includes(currentValue?.value?.toLowerCase()) && currentValue?.label?.toLowerCase()?.includes(el?.full_form?.toLowerCase())) {
          this.filteredAcronyms = el;
        }
      });
      if(!this.filteredAcronyms) {
        this.filteredAcronyms = 'empty';
      }
    } else {
      this.filteredAcronyms = null;
    }
    if(this.dataView)  {
      this.dataView.first = 0;
    }
  }

  ngOnInit(): void {
    this.getAllAcronyms();
    this.authService.isLoggedIn$.subscribe(_ => {
      const user = localStorage.getItem('user');
      if(user) {
        this.userRole = JSON.parse(user)['user_type'];
      }
    });
    this.acronymsService.acronymUpdated$.subscribe(data => {
      if(data) {
        this.getAllAcronyms();
      }
    })
  }

  getAllAcronyms(): void {
    this.acronymsService.getAllAcronyms().subscribe(data => {
      this.acronyms = data;
      this.acronyms.sort((a, b) => {
        if(a.full_form === b.full_form) {
          return 0;
        }
        return a.full_form < b.full_form? -1: 1;
      });
    });
  }

  ConfirmationDialog(acronym: Acronym) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete the acronym <strong>${acronym.acronym_name}</strong>?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAcronym(acronym.acronym_name);
      },
    });
  }

  deleteAcronym(suggestedAcronymName: string) {
    this.acronymsService.deleteAcronym(suggestedAcronymName).subscribe((data: any) => {
      this.acronyms = data;
    })
  }

  show(suggestedAcronym: Acronym) {
    this.ref = this.dialogService.open(EditAcronymComponent, {
      data: {
        suggestedAcronym: suggestedAcronym,
      },
      header: 'Edit Acronym',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }
}
