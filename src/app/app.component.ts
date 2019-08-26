import {
  AfterViewInit,
  Compiler,
  Component,
  Inject,
  Injector,
  NgModuleRef,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { LazyModule } from './lazy/lazy.module';

@Component({
  selector: 'app-root',
  template: `
    <h1>Welcome!</h1>
    <div #here></div>
  `,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  /** Экземпляр Модуля созданного через фабрику */
  moduleRef: NgModuleRef<LazyModule>;
  /** Контейнер для размещения динамического компонента */
  @ViewChild('here', { read: ViewContainerRef, static: true })
  here: ViewContainerRef;

  constructor(
    @Inject(Compiler) private compiler: Compiler,
    @Inject(Injector) private injector: Injector
  ) {}

  ngAfterViewInit(): void {
    import('./lazy/lazy.module')
      .then(m => m.LazyModule)
      .then(lazyModule => {
        this.compiler.compileModuleAsync(lazyModule).then(ngModuleFactory => {
          this.moduleRef = ngModuleFactory.create(this.injector);
          const compFactory = this.moduleRef.componentFactoryResolver.resolveComponentFactory(
            lazyModule.rootEntry
          );
          this.here.createComponent(compFactory);
        });
      });
  }

  ngOnDestroy(): void {
    if (this.moduleRef) {
      this.moduleRef.destroy();
    }
  }
}
