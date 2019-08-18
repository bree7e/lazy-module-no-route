import {
  Component,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  Injector,
  Compiler,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'lazy-module-no-route';

  @ViewChild('testOutlet', { read: ViewContainerRef, static: false })
  testOutlet: ViewContainerRef;
  constructor(private compiler: Compiler, private injector: Injector) {}

  ngAfterViewInit(): void {
    import('src/app/lazy/lazy.module')
      .then(m => m.LazyModule)
      .then(lazyModule => {
        this.compiler.compileModuleAsync(lazyModule).then(ngModuleFactory => {
          const moduleRef = ngModuleFactory.create(this.injector);
          const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(
            lazyModule.rootEntry
          );
          this.testOutlet.createComponent(compFactory);
        });
      });
  }
}

// https://medium.com/@matt.denobrega/for-those-of-you-who-implemented-this-and-are-getting-warnings-about-ngmodulefactoryloader-being-ae20ce1bca20
// https://netbasal.com/the-need-for-speed-lazy-load-non-routable-modules-in-angular-30c8f1c33093
