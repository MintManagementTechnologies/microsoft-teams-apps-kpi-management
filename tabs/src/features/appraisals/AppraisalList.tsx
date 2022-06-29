import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Skeleton, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';
import { selectAppraisalList } from './appraisalSelectors';
// import { useLazyGetAllAppraisalsQuery } from './appraisalService';
// import { listChanged } from './appraisalSlice';
// import GroupedByYearAccordion from './parts/accordion/GroupedByYearAccordion';
// import AppraisalFilter from './parts/filters/AppraisalFilter';
import AppraisalRow from './parts/rowLayouts/AppraisalRow';
import { IAppraisalModel } from './types';

const AppraisalList = (props: { items?: any[], layout?: string, displayMode?: string, isRootList?: boolean }): JSX.Element => {
   const { items, isRootList } = props;
   const displayMode = props.displayMode || 'edit';
   const layout = props.layout || 'flatTable';
   const [allItemsState, setAllItemsState] = useState(items || []);
   const [loadingState, setLoadingState] = useState(true);

   useEffect(() => {
      if(items && items.length > 0) {
         setAllItemsState(items);
         setLoadingState(false);
      }
   });
   
   const dispatch = useAppDispatch();
   const { t, i18n } = useTranslation();
   const hasItems = allItemsState && allItemsState.length > 0;
   const isLoading = loadingState;

   const getListLayout = (_layout: string) => {
      switch (_layout) {
         case `flatTable`:
            return allItemsState.map(item =>
               <AppraisalRow item={item} />
            );
         case `error`:
         default:
            return <ErrorMessage message={`error-AppraisalList`} />;
      }

      
   }

   return (
      <Flex fill gap="gap.small" column>
         {isLoading && layout !== 'dropdown' && <Loader message={t('entity.appraisal', { count: 0 })} />}
         {hasItems && getListLayout(layout)}
      </Flex>
   );
}

export default AppraisalList;