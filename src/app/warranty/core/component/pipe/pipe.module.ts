import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './safeHtml.pipe';
import { DateYMDPipe } from './datePipe';

@NgModule({
    imports: [],
    exports: [
        SafeHtmlPipe,
        DateYMDPipe
    ],
    declarations: [
        SafeHtmlPipe,
        DateYMDPipe
    ],
    providers: [],
})
export class PipeModule { }
