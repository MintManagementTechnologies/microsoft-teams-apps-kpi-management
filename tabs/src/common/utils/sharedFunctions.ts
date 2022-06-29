import { format } from 'date-fns';
// Require Esperanto locale
import { enGB } from 'date-fns/locale';

import { teamsMeetingDateTimeFormat } from './commonVariables';
import { log } from './customConsoleLog';
import { defaultLocale } from './i18n';

export const arraysAreDifferent = (
   arr1: any[],
   arr2: any[],
   fieldToCompare: string = 'id'
): boolean => {
   const areDifferent = arr2.some(function (obj) {
      return !arr1.some(function (obj2) {
         return obj[fieldToCompare] === obj2[fieldToCompare];
      });
   });
   return areDifferent;
};

export const sortBy = (a: string | number | Date, b: string | number | Date, _orderBy: string = 'asc') => {
   let orderByValue = _orderBy === 'asc' ? 1 : -1;
   const fieldA = a.toString().toUpperCase(); // ignore upper and lowercase
   const fieldB = b.toString().toUpperCase(); // ignore upper and lowercase
   // const fieldA = a[fieldToCompare].toString().toUpperCase(); // ignore upper and lowercase
   // const fieldB = b[fieldToCompare].toString().toUpperCase(); // ignore upper and lowercase
   if (fieldA < fieldB) {
      return -1 * orderByValue;
   }
   if (fieldA > fieldB) {
      return 1 * orderByValue;
   }
   return 0;
}

export const distinct = (value: string | number, index: number, self: any) => {
   return self.indexOf(value) === index;
};

export const groupBy = (itemArray: any[], key: string) => {
   return itemArray.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
   }, {});
};

export const upperFirstLetter = (text: string) => {
   return text.charAt(0).toUpperCase() + text.slice(1);
}

export const getBaseUrl = (): string => {
   return (window.location.origin + "/#");
}


export const getApiBaseUrl = (local: boolean = false): string => {
   let returnUrl = '';
   returnUrl = `${process.env.REACT_APP_BACKEND_API}`;
   // returnUrl = `https://pmsapi-uat.hh-converge.com/api`;
   console.log('getApiBaseUrl');
   console.log(returnUrl);
   return returnUrl;
}

export const getLocale = (): string => {
   const params = new URLSearchParams(window.location.hash);
   const locale = params.get("locale") || defaultLocale();
   return locale;
};

// by providing a default string of 'PP' or any of its variants for `formatStr`
// it will format dates in whichever way is appropriate to the locale
const locale = getLocale();
const locales = { enGB };
export const getLocaleDate = (dateTimestamp: number | Date = (new Date().getTime()), _format: string = "dd/MM/yyyy HH:mm") => {
   let date = format(dateTimestamp, _format, {
      //@ts-ignore
      locale: locales[locale]
   })
   return date;
}

export const getDefaultStartAndEndTimes = () => {
   const startDate = new Date();
   startDate.setMinutes(Math.ceil(startDate.getMinutes() / 30) * 30);
   const endDate = new Date();
   endDate.setMinutes(Math.ceil(endDate.getMinutes() / 30) * 30);
   endDate.setHours(endDate.getHours() + 1);

   const startTime = getLocaleDate(startDate, teamsMeetingDateTimeFormat);
   const endTime = getLocaleDate(endDate, teamsMeetingDateTimeFormat);

   return { startTime, endTime };
}

interface IRouteParams {
   userScope: string;
   view: string;
   action: string;
   id: string | undefined;
   pageIndex: number | undefined;
}

export const getRouteParams = (_path: string): IRouteParams => {
   const tmpPath = _path.startsWith('#') ? _path.slice(1) : _path;
   const queryParamIndex = tmpPath.indexOf('?');
   const path = queryParamIndex > -1 ? tmpPath.substring(0, queryParamIndex) : tmpPath;
   const paramArr = path.split('/').splice(1);
   let result: any;
   if (paramArr.length >= 3) {
      result = {
         userScope: paramArr[0],
         view: paramArr[1],
         action: paramArr[2],
         id: paramArr[3],
         pageIndex: undefined
      };

      if (result.action === 'browse' && paramArr.length >= 4) {
         result.pageIndex = paramArr[3] ? parseInt(paramArr[3]) : 1;
      } else if (
         (result.action === 'edit' || result.action === 'view' || result.action === 'approve') &&
         paramArr.length >= 4
      ) {
         result.id = paramArr[3];
      }
   } else {
      result = {
         userScope: 'NA',
         view: 'NA',
         action: 'NA',
         layout: 'NA',
         id: 'NA',
         pageIndex: -1
      };
   }
   return result;
};
interface IAvatarIconColors {
   backgroundColor: string;
   color: string;
}

export const stringToHslColor = (userIdentifier: string): IAvatarIconColors => {
   var hash = 0;
   for (var i = 0; i < userIdentifier.length; i++) {
      hash = userIdentifier.charCodeAt(i) + ((hash << 5) - hash);
   }

   var h = hash % 360;
   var l = 80;
   var s = 30
   return {
      backgroundColor: 'hsl(' + h + ', ' + s + '%, ' + l + '%)',
      color: l > 70 ? '#555' : '#fff'
   }
}