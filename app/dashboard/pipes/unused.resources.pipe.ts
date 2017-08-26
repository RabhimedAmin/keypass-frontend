import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/

@Pipe({ name: 'unusedResources' })
export class UnusedResourcesPipe implements PipeTransform {
  transform(allResources: any[], managedRes: any[]) {
    return allResources.filter(res => !managedRes.includes(res));
  }
}
