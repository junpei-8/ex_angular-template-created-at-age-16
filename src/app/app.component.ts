import { ChangeDetectionStrategy, Component, DoCheck, Inject, OnInit } from '@angular/core';
// import { routeAnimation } from './animations';
import { ExpService, LOADING_USER_EXP } from './services/exp';
import { BreakpointObserverService, RouteObserverService, ThemeCssVariablesService } from './services/service';
import { RouteStore, ROUTE_STORE } from './services/store';
import { ModalOutletService } from './components/modal-outlet';
import { MatDialogLiteService, MAT_DIALOG_LITE_DATA } from './components/material-lite/dialog';
import { transition, trigger, useAnimation } from '@angular/animations';
import { MAT_AMT_DURATION, MAT_AMT_FUNCTION, opacityFadeOutInForChild } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimation', [
      transition('Home => *, NotFound => *',
        useAnimation(opacityFadeOutInForChild, {
          params: {
            duration: MAT_AMT_DURATION.faster.string,
            function: MAT_AMT_FUNCTION.angular
          },
        }
      ))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, DoCheck {
  title: string = 'angular-template';
  private _doCheckCount: number = 0;

  routeKey: string;
  hasLoaded: boolean;

  private _currentTheme = 'light';

  constructor(
    private _routeObserver: RouteObserverService,
    private _breakpointObserver: BreakpointObserverService,
    public modalOutlet: ModalOutletService,
    private _matDialogLite: MatDialogLiteService,
    private _themeCssVariables: ThemeCssVariablesService,
    @Inject(ROUTE_STORE) public routeStore: RouteStore,
    @Inject(LOADING_USER_EXP) private _loadingUser: ExpService,
  ) { _themeCssVariables.set('light'); }

  ngOnInit(): void {
    this._routeObserver.subscribe();

    this._breakpointObserver.platform.subscribe();
    this._breakpointObserver.size.subscribe();

    this.routeStore.storeChanges()
      .subscribe(store => {
        this.routeKey = store.state.data.key[0];
      });

    // "User data"をロードしたときを想定したテスト
    setTimeout(() => {
      this._loadingUser.exp();
    }, 1000);
  }

  ngDoCheck(): void {
    this._doCheckCount++;
    console.log(this._doCheckCount);
  }

  modalOutput(temp: any): void {
    this._matDialogLite.open(TestComponent, { data: 'xxxxxx' });
    // const ref = this.modalOutlet.output(TestComponent, { needUseOverlay: true });
    // ref.backdropClick().subscribe(() => this.modalOutlet.close(ref));
  }

  toggleTheme(): void {
    if (this._currentTheme === 'light') {
      this._currentTheme = 'dark';
      this._themeCssVariables.set('dark');

    } else {
      this._currentTheme = 'light';
      this._themeCssVariables.set('light');
    }
  }
}

@Component({
  selector: 'app-test',
  styles: [
    `
      :host {
        display: block;
        height: 80vh;
        width: 80vw;
      }
    `
  ],
  template: `<div>これはテストです {{ dialogData }} </div>`
})
export class TestComponent {
  constructor(
    @Inject(MAT_DIALOG_LITE_DATA) public dialogData: any
  ) {
    console.log('Loaded Test component');
    console.log(dialogData);
  }
}
