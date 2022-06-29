import { IAppraisalPeriodModel } from './types';

export default [
   {
      id: 1,
      title: 'Jan - Jun 2021',
      status: 'current', // none, current
      startTimestamp: new Date(2021, 1, 1).getTime(),
      endTimestamp: new Date(2021, 6, 30).getTime(),
      startMonthIndex: 0,
      endMonthIndex: 5,
      year: 2021,
      reminderFrequency: 'daily',
      active: true,
   },
   {
      id: 2,
      title: 'Jul - Dec 2021',
      status: 'current', // none, current
      startTimestamp: new Date(2021, 6, 1).getTime(),
      endTimestamp: new Date(2021, 12, 31).getTime(),
      startMonthIndex: 6,
      endMonthIndex: 11,
      year: 2021,
      reminderFrequency: 'weekly',
      active: true,
   },
   {
      id: 3,
      title: 'Jan - Jun 2022',
      status: 'current', // none, current
      startTimestamp: new Date(2022, 1, 1).getTime(),
      endTimestamp: new Date(2022, 6, 30).getTime(),
      startMonthIndex: 0,
      endMonthIndex: 5,
      year: 2022,
      reminderFrequency: 'daily',
      active: true,
   },
   {
      id: 4,
      title: 'Jul - Dec 2022',
      status: 'current', // none, current
      startTimestamp: new Date(2022, 6, 1).getTime(),
      endTimestamp: new Date(2022, 12, 31).getTime(),
      startMonthIndex: 6,
      endMonthIndex: 11,
      year: 2022,
      reminderFrequency: 'weekly',
      active: true,
   },
] as IAppraisalPeriodModel[]