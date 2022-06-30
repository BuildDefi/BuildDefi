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
      particlesJS.load('particles3', 'assets/particles3.json', function() {});
    }, 500);
  }
}