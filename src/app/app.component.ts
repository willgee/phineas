import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  isExpanded = false;
  currentNavID = "WLCM"; // Initialize to the welcome page
  currentNavDetail = {
    WLCM: false,
    GEO: false,
    DATA: false,
    NLP: false,
    VIZ: false,
    SRCH: false
  };

  toggleNavDetail(navID: string) {
    if (navID === "WLCM") {
      for (let detail in this.currentNavDetail) {
        this.currentNavDetail[detail] = false;
      }
      this.isExpanded = false;
    } else {
      if (this.currentNavID !== navID) {
        this.currentNavID = navID;
        for (let detail in this.currentNavDetail) {
          this.currentNavDetail[detail] = false;
        }
        setTimeout(() => {
          this.currentNavDetail[navID] = true;
          this.isExpanded = true;
        }, 500);
      } else {
        this.currentNavDetail[navID] = !this.currentNavDetail[navID];
        this.isExpanded = !this.isExpanded;
      }
    }
  }

  onPanelSelect(panel: HTMLDivElement) {
    panel.previousElementSibling.classList.toggle("active");
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
}
