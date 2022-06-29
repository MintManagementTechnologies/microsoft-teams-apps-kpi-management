import i18n from './i18n';

export const monthOptions = [
   { header: "Jan", key: 0 },
   { header: "Feb", key: 1 },
   { header: "Mar", key: 2 },
   { header: "Apr", key: 3 },
   { header: "May", key: 4 },
   { header: "Jun", key: 5 },
   { header: "Jul", key: 6 },
   { header: "Aug", key: 7 },
   { header: "Sept", key: 8 },
   { header: "Oct", key: 9 },
   { header: "Nov", key: 10 },
   { header: "Dec", key: 11 },
];

export const yearOptions = [
   { header: '2018', key: 2018 },
   { header: '2019', key: 2019 },
   { header: '2020', key: 2020 },
   { header: '2021', key: 2021 },
   { header: '2022', key: 2022 },
   { header: '2023', key: 2023 },
   { header: '2024', key: 2024 }
];
// TODO: CHANGE TO FUNC
export const reminderFrequencyOptions = [
   {
      key: 'daily',
      header: 'Daily',
      content: 'Send a reminder daily at 8am'
   },
   {
      key: 'weekly',
      header: 'Weekly',
      content: 'Send a reminder weekly, first work day of the week at 8am.'
   },
   {
      key: 'monthly',
      header: 'Monthly',
      content: 'Send a reminder monthly, first work day of the month at 8am.'
   }
];

export const getStatusOptions = () => {
   return [
      {
         name: i18n.t('form.status.value.active'),
         key: 'active',
         label: i18n.t('form.status.value.active'),
         value: 1,
      },
      {
         name: i18n.t('form.status.value.inactive'),
         key: 'inactive',
         label: i18n.t('form.status.value.inactive'),
         value: 0,
      }
   ]
}