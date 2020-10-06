import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppRouteData } from 'src/app/app-routing';
import { ROUTE_STORE, RouteStore } from '../store';

interface AppActivatedRouteSnapshot extends ActivatedRouteSnapshot {
  data: AppRouteData;
}
@Injectable({
  providedIn: 'root'
})
export class RouteObserverService {

  private _subscription: Subscription | null;

  constructor(
    private _title: Title,
    private _meta: Meta,
    private _router: Router,
    private _route: ActivatedRoute,
    @Inject(ROUTE_STORE) private _routeStore: RouteStore
  ) {}

  subscribe(): void {
    if (this._subscription) { return; }

    this._subscription = this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this._route),
        map(route => {
          while (route.firstChild) { route = route.firstChild; }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        map(route => route.snapshot as AppActivatedRouteSnapshot)
      )
      .subscribe(route => {
        const routeState = this._routeStore.state;

        const pathname = location.pathname;
        if (pathname !== routeState.pathname) {
          // pathnameだけ変更された場合

          this._routeStore.dispatch({ type: 'CHANGE_PATHNAME', payload: { pathname, data: route.data } });
          this._updateMeta(route.data);
        } else {
          // fragmentだけ変更された場合

          this._routeStore.dispatch({ type: 'CHANGE_FRAGMENT', payload: route.fragment });
        }
      });
  }

  unsubscribe(): void {
    if (!this._subscription) { return; }

    this._subscription.unsubscribe();
    this._subscription = null;
  }

  private _updateMeta(routeData: AppRouteData): void {
    if (routeData.desc) { this._meta.updateTag({ name: 'description', content: routeData.desc }); }
    if (routeData.themeColor) { this._meta.updateTag({ name: 'theme-color', content: routeData.themeColor }); }
    if (routeData.keywords) { this._meta.updateTag( { name: 'keywords', content: routeData.keywords }); }
    if (routeData.noIndex) { this._meta.updateTag({ name: 'robots', content: 'noindex' }); }


    const commonTitle = 'Angular template';
    const commonTitleLine = '-';

    const entryTitle = routeData.title ?
      routeData.title + (routeData.disableCommonMetaTitle ? '' : ` ${commonTitleLine} ${commonTitle}`) :
      routeData.disableCommonMetaTitle ? '' : commonTitle;
    this._title.setTitle(entryTitle);
  }
}
