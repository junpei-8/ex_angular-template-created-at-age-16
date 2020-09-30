import { ChangeDetectionStrategy, Component, DoCheck, Inject, OnInit } from '@angular/core';
import { routeAnimation } from './animations';
import { ExpService, LOADING_USER_EXP } from './services/exp';
import { BreakpointObserverService, RouteObserverService, ThemeCssVariablesService } from './services/service';
import { RouteStore, ROUTE_STORE } from './services/store';
import { ModalOutletService } from './components/modal-outlet';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ routeAnimation ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, DoCheck {
  title: string = 'angular-template';
  testComponent = TestComponent;
  private _doCheckCount: number = 0;

  routeKey: string;
  hasLoaded: boolean;

  constructor(
    private _routeObserver: RouteObserverService,
    private _breakpointObserver: BreakpointObserverService,
    private _themeCssVariables: ThemeCssVariablesService,
    public modalOutlet: ModalOutletService,
    @Inject(ROUTE_STORE) public routeStore: RouteStore,
    @Inject(LOADING_USER_EXP) private _loadingUser: ExpService
  ) {}

  ngOnInit(): void {
    console.log(this.testComponent);
    this._routeObserver.subscribe();

    this._breakpointObserver.platform.subscribe();
    this._breakpointObserver.size.subscribe();

    this.routeStore.storeChanges
      .subscribe(store => {
        const routeData = store.state.data;
        this.routeKey = routeData.parentKey || routeData.key;
      });

    // "User data"をロードしたときを想定したテスト
    setTimeout(() => {
      this._loadingUser.exp();
      this._themeCssVariables.set('dark');
    }, 1000);
  }

  ngDoCheck(): void {
    this._doCheckCount++;
    console.log(this._doCheckCount);
  }

  modalOutput(temp: any): void {
    const ref = this.modalOutlet.output(temp, { needUseOverlay: true, });
    const subscription = ref.backdropClick.subscribe(res => console.log(res));
    setTimeout(() => this.modalOutlet.close(ref), 2400);
  }
}

@Component({
  selector: 'app-test',
  template: `<div>これはテストです</div>`
})
export class TestComponent {}
