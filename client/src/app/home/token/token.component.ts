import { Component, OnInit } from "@angular/core";
declare var particlesJS: any;

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      particlesJS.load('particles2', 'assets/particles2.json', function() {});
    }, 500);
  }
}