import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Acronym } from 'src/app/interfaces/acronym.interface';

@Component({
  selector: 'app-home-data-view',
  templateUrl: './home-data-view.component.html',
  styleUrls: ['./home-data-view.component.scss'],
})
export class HomeDataViewComponent implements OnChanges{
  @Input() searchedAcronym: string = '';
  filteredAcronyms!: any;
  acronyms: Acronym[] = [
    {
      AcronymName: 'SPS',
      FullForm: 'School of Professional Studies',
      Description:
        'The School of Professional Studies (SPS) serves the needs of recent graduates and working professionals seeking to advance in their jobs and careers. Students of diverse ages and backgrounds learn together in a context where various perspectives are welcomed and all experience is valued.',
      Location: 'Jonas clark, Clark University, 950 Main street',
      Phone: '+1 508-793-7218',
      Email: 'SPS@clarku.edu',
      CreatedOn: new Date(Date.now()),
      WebsiteLink: 'https://www.clarku.edu/schools/professional-studies/',
    },
    {
      AcronymName: 'SOM',
      FullForm: 'School of Management',
      Description:
        'As a management school based at a liberal arts university, the School of Management (SOM) provides a rigorous business education focused on a human context. Lessons in ethics and corporate responsibility go hand in hand with accounting and finance — the common ground being leadership, vision, and success.',
      Location: 'Carlson Hall, Clark University, 950 Main street',
      Phone: '+1 508-793-7543',
      Email: 'Somstudentservices@clarku.edu',
      CreatedOn: new Date(Date.now()),
      WebsiteLink: 'https://www.clarku.edu/schools/management/',
    },
    {
      AcronymName: 'BSDT',
      FullForm: 'Becker School of Design & Technology',
      Description:
        "Featuring one of the world’s top five Game Design programs and top 10 Master of Fine Arts programs per The Princeton Review, the Becker School of Design & Technology provides students with a real-world studio environment to prepare them for lifelong careers in an exciting, rapidly changing industry. We also offer a 4+1 program, allowing students to obtain a B.A. in Interactive Media Design, then add a fifth year to pursue the MFA.",
      Location: '950 Main Street',
      Phone: '+1 508-793-7431',
      CreatedOn: new Date(Date.now()),
      Email: 'BSDT@clarku.edu',
      WebsiteLink: 'https://www.clarku.edu/schools/becker-school-of-design-and-technology/',
    },
  ];

  getAcronyms() {
    return this.filteredAcronyms? this.filteredAcronyms != 'empty'? [this.filteredAcronyms]: []: this.acronyms;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes['searchedAcronym'].currentValue;
    if(currentValue) {
      this.acronyms.filter(el => {
        if(el.AcronymName?.toLowerCase()?.includes(currentValue?.value?.toLowerCase()) && currentValue?.label?.toLowerCase()?.includes(el?.FullForm?.toLowerCase())) {
          this.filteredAcronyms = el;
        }
      });
      if(!this.filteredAcronyms) {
        this.filteredAcronyms = 'empty';
      }
    } else {
      this.filteredAcronyms = null;
    }
  }
}
