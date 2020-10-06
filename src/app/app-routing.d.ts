import { Route } from '@angular/router';

export declare interface AppRouteData {
  key: string[];

  // Meta Data
  title?: string;
  desc?: string;
  keywords?: string;
  noIndex?: boolean;
  themeColor?: string;
  disableCommonMetaTitle?: boolean;
}

// Routes = Route[]
interface AppRoute extends Route {
  data?: AppRouteData;
  children?: AppRoute[];
}
export declare type AppRoutes = AppRoute[];
