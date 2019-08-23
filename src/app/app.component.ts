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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'lazy-module-no-route';
  moduleRef: NgModuleRef<LazyModule>;

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
