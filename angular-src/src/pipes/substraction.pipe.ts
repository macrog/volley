import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'sub' })

export class SubPipe implements PipeTransform {
  transform(setFinalScore: string): string {
      const result = setFinalScore.split(':');
      const total = Number(result[1]) - Number(result[0]);
      return total > 0 ? '+' + total.toString() :  total.toString();
  }
}
