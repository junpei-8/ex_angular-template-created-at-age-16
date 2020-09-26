import { DOCUMENT } from '@angular/common';
import { ComponentRef, Inject, Injectable, TemplateRef } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { RENDERER, RendererService } from '../../services/renderer.service';


type RefType = 'template' | 'component';

interface OutputData {
  refType: RefType;
  index: number;
  needUseOverlay: boolean;
  backdropClick: Observable<void>;
}
interface OutputConfig {
  needUseOverlay?: boolean;
}
interface ConfigStorage extends OutputConfig {
  hasSubscribedBackdropClick?: boolean;
}

type ComponentType<T> = new (...args: any[]) => T;

type IntoModalField<T> = { ref: T, config: ConfigStorage };
type TemplateRefData = IntoModalField<TemplateRef<any>>;
type ComponentRefData = IntoModalField<ComponentType<any>>;

export type ModalOutletPrivateTemplates = (TemplateRefData | null)[];
export type ModalOutletPrivateComponents = (ComponentRefData | null)[];

export type ModalOutletTemplates = TemplateRefData[];
export type ModalOutletComponents = ComponentRefData[];

@Injectable({
  providedIn: 'root'
})
export class ModalOutletService {
  needUseOverlay: boolean | undefined;

  private _templates: ModalOutletPrivateTemplates = [];
  templatesChanges = new Subject<ModalOutletTemplates>();

  private _components: ModalOutletPrivateComponents = [];
  componentsChanges = new Subject<ModalOutletComponents>();

  private _modalOutletElement: Element;

  private _backdropClickSubject: Subject<void> | null = null;
  private _backdropClickHandler: () => void;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(RENDERER) private _renderer: RendererService
  ) {}

  output<T extends RefType>(
    ref: T extends 'template' ? TemplateRef<any> : ComponentType<any>,
    config: OutputConfig = {}
  ): OutputData {
    if (!this._modalOutletElement) {
      this._modalOutletElement = this._document.getElementsByTagName('modal-outlet')[0] as Element;
    }

    const refType: 'template' | 'component' =
      (ref instanceof TemplateRef) ? 'template' :
        (typeof ref === 'function') ? 'component' : '' as any; // <= 型チェックを外す


    if (refType === 'template') {
      const templates = [ ...this._templates, { ref: ref as TemplateRef<any>, config } ];
      this.templatesChanges.next(templates.filter(v => v) as ModalOutletTemplates);
      this._templates = templates;

    } else if (refType === 'component') {
      const components = [ ...this._components, { ref: ref as ComponentType<any>, config }];
      this.componentsChanges.next(components.filter(v => v) as ModalOutletComponents);
      this._components = components;

    } else { throw new Error(''); }


    this._renderer.addClass(this._modalOutletElement, 'content-exists');

    if (config.needUseOverlay) {
      this.needUseOverlay = true;
      this._renderer.addClass(this._modalOutletElement, 'overlay');
    }

    const that = this;
    const index = (refType === 'template' ? this._templates.length : this._components.length) - 1;
    return {
      refType, index,
      needUseOverlay: false,
      get backdropClick(): Observable<void> {
        refType === 'template' ?
          // @ts-ignore
          that._templates[index].config.hasSubscribedBackdropClick = true :
          // @ts-ignore
          that._components[index].config.hasSubscribedBackdropClick = true;

        if (!that._backdropClickSubject) {
          that._backdropClickSubject = new Subject();
          that._backdropClickHandler = that._renderer.listen(
            that._modalOutletElement, 'click',
            // @ts-ignore
            () => that._backdropClickSubject.next()
          );
        }
        // @ts-ignore
        return that._backdropClickSubject.asObservable();
      }
    };
  }


  close(outputData: OutputData, delay?: number): void {
    (delay) ? setTimeout(() => this._onclose(outputData), delay) : this._onclose(outputData);
  }
  private _onclose(outputData: OutputData): void {
    let needUseOverlay: true | undefined;
    let hasSubscribedBackdropClick: true | undefined;

    // 一回限りの処理のため、下のforのスコープの外で行う
    (outputData.refType === 'template') ?
      this._templates[outputData.index] = null : this._components[outputData.index] = null;

    let processKey = outputData.refType;
    for (let i = 0; i < 2; i = (i + 1) | 0) {
      if (processKey === 'template') {
        const result = configChecker(this._templates);
        this.templatesChanges.next(result.nonNullableRefs);

        // _templatesの中身がすべてnullだった場合GC
        // すべてnullである = configはすべてfalseであることが確定するので、_templatesの中身があるときのみconfigを整理する処理を行う
        if (!result.nonNullableRefs.length) {
          this._templates = [];
        } else {
          needUseOverlay = needUseOverlay || result.needUseOverlay;
          hasSubscribedBackdropClick = hasSubscribedBackdropClick || result.hasSubscribedBackdropClick;
        }

        // 初回の実行でかつ、_templatesのConfigの中身がすべてTrueになっていなかったら
        if (i === 0 && (!result.allTrue)) { processKey = 'component'; }

      } else if (processKey === 'component') {
        const result = configChecker(this._components);
        this.componentsChanges.next(result.nonNullableRefs);

        // _componentsの中身がすべてnullだった場合
        // すべてnullである = configはすべてfalseであることが確定するので、_componentsの中身があるときのみconfigを整理する処理を行う
        if (!result.nonNullableRefs.length) {
          this._components = [];
        } else {
          needUseOverlay = needUseOverlay || result.needUseOverlay;
          hasSubscribedBackdropClick = hasSubscribedBackdropClick || result.hasSubscribedBackdropClick;
        }


        // 初回の実行でかつ、_componentsのConfigの中身がすべてTrueになっていなかったら
        if (i === 0 && (!result.allTrue)) { processKey = 'template'; }
      }
    }

    const allEmpty: boolean = !(this._templates.length + this._components.length);

    if (allEmpty) {
      this._renderer.removeClass(this._modalOutletElement, 'content-exists');
    }

    this.needUseOverlay = needUseOverlay;
    if (needUseOverlay) {
      this._renderer.addClass(this._modalOutletElement, 'overlay');
    } else {
      this._renderer.removeClass(this._modalOutletElement, 'overlay');
    }

    if (!hasSubscribedBackdropClick && this._backdropClickSubject) {
      // どれも、backdropClickSubjectをsubscribeしていなかったらBackdropClickObservableをGC
      this._backdropClickSubject.complete();
      this._backdropClickSubject = null;
      this._backdropClickHandler();
    }
  }
}

// type NonNullableRefs = ModalOutletNonNullableComponents | ModalOutletNonNullableTemplates;
type ConfigCheckerResult<R> = {
  allTrue: true | undefined,
  nonNullableRefs: R
} & {
  [key in NonNullable<keyof ConfigStorage>]: true | undefined
};
function configChecker<
  T extends ModalOutletPrivateComponents | ModalOutletPrivateTemplates,
  R = T extends ModalOutletPrivateComponents ? ModalOutletComponents : ModalOutletTemplates
>(refs: T): ConfigCheckerResult<R> {
  let nonNullableRefs: any[] = []; // => 型が複雑なため any[] で

  let needUseOverlay: true | undefined;
  let hasSubscribedBackdropClick: true | undefined;

  const refLength = refs.length;
  for (let i = 0; i < refLength; i = (i + 1) | 0) {
    if (refs[i]) {
      nonNullableRefs = [ ...nonNullableRefs, refs[i] as any ];
      // @ts-ignore: 存在する
      const config = refs[i].config;

      if (config.needUseOverlay) { needUseOverlay = true; }
      if (config.hasSubscribedBackdropClick) { hasSubscribedBackdropClick = true; }
    }
  }

  return {
    allTrue: needUseOverlay && hasSubscribedBackdropClick,
    // @ts-ignore: 複雑な型なのでlintが正しく判断しないため
    nonNullableRefs,
    needUseOverlay,
    hasSubscribedBackdropClick
  };
}
