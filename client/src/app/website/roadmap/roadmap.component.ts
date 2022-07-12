import { Component, HostListener, OnInit } from "@angular/core";
declare var particlesJS: any;

@Component({
    selector: 'app-roadmap',
    templateUrl: './roadmap.component.html',
    styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements OnInit {
  opts: any = {};

  ngOnInit() {
    setTimeout(() => {
      particlesJS.load('particles2', 'assets/particles2.json', function() {});
    }, 500);
    this.onResize({ target: window });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const { innerWidth } = event.target;
    let opts = { slidesPerView: 1 };


    if (innerWidth > 640) {
      opts = { slidesPerView: 2 };
    }

    if (innerWidth > 968) {
      opts = { slidesPerView: 3 };
    }

    if (innerWidth > 1300) {
      opts = { slidesPerView: 4 };
    }

    this.opts = opts;
  }
}