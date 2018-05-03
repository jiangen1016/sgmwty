import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateYMD'
})

export class DateYMDPipe implements PipeTransform {
    transform(dateString: any): any {
        if (typeof dateString === 'string') {
            return dateString.split(' ')[0];
        } else {
            return '';
        }
    }
}
