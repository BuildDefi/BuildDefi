import { AfterContentInit, Component, ContentChild, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { IonInput } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit, OnDestroy, AfterContentInit {

  @HostBinding('class.invalid') invalid: boolean = false;
  @ContentChild(IonInput) input: any;
  intervalId: any;
  inputClassChange = new BehaviorSubject<string>(null);
  mutationOb: MutationObserver;

  constructor() { }

  ngOnInit() {
    this.inputClassChange.pipe(
      debounceTime(50),
      distinctUntilChanged()
    ).subscribe(className => {
      if (className) {
        this.invalid = (className.includes('ng-invalid') && (className.includes('ng-touched') || className.includes('has-focus')));
      }
    });
  }

  ngAfterContentInit() {
    const mutationObserver = new MutationObserver(records => {
      const last = records[records.length - 1];
      const className = (last.target as any).className;

      if (typeof className === 'string') {
        this.inputClassChange.next(className);
      }
    });

    mutationObserver.observe(this.input.el, {
      attributeFilter: ['class']
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
