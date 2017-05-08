import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pageFilter',
    pure: false
})
export class PageFilter implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items
            .filter((item, index) => 
                index >= filter.itemsperpage * (filter.currentPage - 1)
            &&  index < filter.itemsperpage * filter.currentPage);

            //.filter((item, index)) => item.title.indexOf(filter.title) !== -1);

    }
}