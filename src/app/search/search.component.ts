import { Component, OnInit } from '@angular/core';
import { Survey } from '../models/survey.interface';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private http: HttpClient) { }

  checked: boolean;
  surveys: Survey[];
  surveysView: Survey[];
  filterArray: String[];
  filterObject = {
    A4: false,
    'Agile JCITA': false,
    'Agile Workforce': false,
    'Asset Space': false,
    CCDB: false,
    CHROME: false,
    OWL: false,
    'CORE D': false,
    CRATE: false,
    COLISEUM: false,
    DICE: false,
    RIPTIDE: false,
    'SCRM TAC': false,
  }
  
  getJSONSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>("assets/data/surveys.json");
  }

  onFilterSelect(event: any) {
    this.filterArray = [];   
    for (const key in this.filterObject) {
      if (this.filterObject[key] == true) {
        this.filterArray.push(key);
      }
    }
    this.surveysView = this.surveys.filter(survey => this.filterArray.includes(survey.projectTitle));
    // console.log(this.filterArray);
  }

  ngOnInit() {
    this.getJSONSurveys().subscribe(data => {
      // console.log(data);
      this.surveys = data;
    });
  }

}
