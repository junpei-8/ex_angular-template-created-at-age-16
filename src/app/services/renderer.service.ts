import { RendererFactory2, Renderer2, InjectionToken, inject } from '@angular/core';

export type RendererService = Renderer2;
export const RENDERER = new InjectionToken<Renderer2>('Renderer for service class', {
  providedIn: 'root',
  // @ts-ignore
  factory: () => inject(RendererFactory2).createRenderer(null, null)
});
