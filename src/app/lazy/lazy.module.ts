import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OneComponent } from './one/one.component';
import { TwoComponent } from './two/two.component';
import { EntryComponent } from './entry/entry.component';

@NgModule({
  declarations: [OneComponent, TwoComponent, EntryComponent],
  entryComponents: [EntryComponent],
  imports: [CommonModule],
})
export class LazyModule {
  static rootEntry = EntryComponent;
}
