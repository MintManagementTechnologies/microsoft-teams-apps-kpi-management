import './AppraisalPeriodFilter.scss';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown, Flex, Skeleton, Text } from '@fluentui/react-northstar';

import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { useGetAllAppraisalPeriodsQuery } from '../../appraisalPeriodService';
import { itemChanged } from '../../appraisalPeriodSlice';
import { IAppraisalPeriodModel } from '../../types';

const AppraisalPeriodFilter = (props: { items?: IAppraisalPeriodModel[], disabled?: boolean }): JSX.Element => {
   const { items, disabled } = props;

   const selectedList = useTypedSelector((state: RootState) => state.appraisalPeriod.list);
   const selectedItem = useTypedSelector((state: RootState) => state.appraisalPeriod.item);

   const { data: dataGetAllAppraisalPeriods, isFetching: isFetchingGetAllAppraisalPeriods, isLoading: isLoadingGetAllAppraisalPeriods }
      = useGetAllAppraisalPeriodsQuery();
   const allItems = items || dataGetAllAppraisalPeriods || selectedList;
   const defaultItem = allItems.find(item => item.active);

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   // Init Item
   useEffect(() => {
      if (defaultItem !== undefined && selectedItem.id <= 0) {
         dispatch(itemChanged(defaultItem));
      }
   }, [defaultItem]);

   const handleDropdownChange = (event: any, value: any): void => {
      if (event !== null) event.preventDefault();
      let selectedAppraisalPeriod = allItems.find(x => x.id === value.key);
      dispatch(itemChanged(selectedAppraisalPeriod));
   }

   const isLoading = isFetchingGetAllAppraisalPeriods || isLoadingGetAllAppraisalPeriods;

   if (isLoading) {
      return (
         <Flex fill column vAlign="center">
            <Skeleton animation="pulse">
               <Skeleton.Line width="50%" />
               <br />
               <Skeleton.Input fluid />
            </Skeleton>
         </Flex>)
   }

   const dropdownOptions = allItems.map((x, i) => ({
      key: x.id,
      header: (x.id === defaultItem?.id ? 'Current: ' : 'Previous: ') + `${x.title} (${x.id})`,
   }));
   return (
      <Flex gap='gap.small' column>
         <Text content={t('entity.appraisalPeriod', { count: 0 })} className={'mmt-appraisalPeriodFilter-label'} />
         <Dropdown
            items={dropdownOptions}
            placeholder={t('form.period.placeholder')}
            defaultValue={dropdownOptions.find(x => x.key === defaultItem?.id)}
            onChange={(event, { value }) => handleDropdownChange(event, value)}
            disabled={disabled}
            checkable
            fluid
         />
      </Flex>
   );
}

export default AppraisalPeriodFilter;