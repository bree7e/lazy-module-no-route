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

  @ViewChild('testOutlet', { read: ViewContainerRef, static: false })
  testOutlet: ViewContainerRef;
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
          this.testOutlet.createComponent(compFactory);
        });
      });
  }

  ngOnDestroy(): void {
    if (this.moduleRef) {
      this.moduleRef.destroy();
    }
  }
}

// https://medium.com/@matt.denobrega/for-those-of-you-who-implemented-this-and-are-getting-warnings-about-ngmodulefactoryloader-being-ae20ce1bca20
// https://netbasal.com/the-need-for-speed-lazy-load-non-routable-modules-in-angular-30c8f1c33093
