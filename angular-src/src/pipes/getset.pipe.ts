import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'getset' })

export class GetSetPipe implements PipeTransform {
  transform(set: string, position: number): string {
      return set.split(':')[position].replace(/\s/g, '');
  }
}
