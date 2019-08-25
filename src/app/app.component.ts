import {
  Component,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  Injector,
  Compiler,
  OnDestroy,
  NgModuleRef,
} from '@angular/core';
import { LazyModule } from './lazy/lazy.module';

@Component({
  selector: 'app-root',
  template: `<h1>Welcome!</h1><div #here></div>`,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  /** Экземпляр Модуля созданного через фабрику */
  moduleRef: NgModuleRef<LazyModule>;
  /** Контейнер для размещения динамического компонента */
  @ViewChild('here', { read: ViewContainerRef, static: true })
  here: ViewContainerRef;

  constructor(private compiler: Compiler, private injector: Injector) {}

  ngAfterViewInit(): void {
    import('src/app/lazy/lazy.module')
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
