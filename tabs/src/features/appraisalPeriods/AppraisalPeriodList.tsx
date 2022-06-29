import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Skeleton, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';
import { selectAppraisalPeriodList } from './appraisalPeriodSelectors';
import { useLazyGetAllAppraisalPeriodsQuery } from './appraisalPeriodService';
import { listChanged } from './appraisalPeriodSlice';
import GroupedByYearAccordion from './parts/accordion/GroupedByYearAccordion';
import AppraisalPeriodFilter from './parts/filters/AppraisalPeriodFilter';
import AppraisalPeriodRow from './parts/rowLayouts/AppraisalPeriodRow';
import { IAppraisalPeriodModel } from './types';

const AppraisalPeriodList = (props: { items?: IAppraisalPeriodModel[], layout?: string, displayMode?: string, isRootList?: boolean }): JSX.Element => {
   const { items, isRootList } = props;
   const displayMode = props.displayMode || 'edit';
   const layout = props.layout || 'groupedByYearAccordion';
   const [allItemsState, setAllItemsState] = useState(items || []);
   


   const dispatch = useAppDispatch();
   const { t, i18n } = useTranslation();

   const selectedList = useTypedSelector((state: RootState) => state.appraisalPeriod.list);
   const [triggerGetAllAppraisalPeriods,
      { data: dataGetAllAppraisalPeriods, isFetching: isFetchingGetAllAppraisalPeriods, isLoading: isLoadingGetAllAppraisalPeriods }]
      = useLazyGetAllAppraisalPeriodsQuery();

   // Init Item
   useEffect(() => {
      if (!isRootList) return;
      if (items) {
         dispatch(listChanged(items));
         return;
      }
      triggerGetAllAppraisalPeriods();
   }, []);

   // Init Item
   useEffect(() => {
      if (!dataGetAllAppraisalPeriods) return;
      dispatch(listChanged(dataGetAllAppraisalPeriods));
      setAllItemsState(dataGetAllAppraisalPeriods);
   }, [dataGetAllAppraisalPeriods]);

   const isLoading = isLoadingGetAllAppraisalPeriods || isFetchingGetAllAppraisalPeriods;
   const hasItems = !isLoading && allItemsState && allItemsState.length > 0;

   const getListLayout = (_layout: string) => {
      switch (_layout) {
         case `groupedByYearAccordion`:
            return <GroupedByYearAccordion />;
         case `flatTable`:
            return allItemsState.map(item =>
               <AppraisalPeriodRow item={item} key={`key-appraisalPeriod-${item.id}`} />
            );
         case `error`:
         default:
            return <ErrorMessage message={`error-AppraisalPeriodList`} />;
      }
   }

   return (
      <Flex fill gap="gap.small" column>
         {isLoading && layout !== 'dropdown' && <Loader message={t('entity.appraisalPeriod', { count: 0 })} />}
         {hasItems && getListLayout(layout)}
      </Flex>
   );
}

export default AppraisalPeriodList;