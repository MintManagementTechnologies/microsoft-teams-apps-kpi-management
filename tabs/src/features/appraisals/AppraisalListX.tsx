import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Header, Skeleton, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';
import { selectAppraisalList } from './appraisalSelectors';
// import { useLazyGetAllAppraisalsQuery } from './appraisalService';
// import { listChanged } from './appraisalSlice';
// import GroupedByYearAccordion from './parts/accordion/GroupedByYearAccordion';
// import AppraisalFilter from './parts/filters/AppraisalFilter';
import AppraisalRow from './parts/rowLayouts/AppraisalRow';
import AppraisalRowX from './parts/rowLayouts/AppraisalRowX';
import MyAppraisalRow from './parts/rowLayouts/MyAppraisalRow';
import { IAppraisalModel, IAppraisalX } from './types';

const AppraisalListX = (props: { items?: IAppraisalX[], layout?: string, userId?: number, loading?: boolean }): JSX.Element => {
   const { items, userId, loading } = props;
   const layout = props.layout || 'groupedByUserAccordion';
   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedAppraisals = useTypedSelector((state: RootState) => state.appraisal.list);

   // const [triggerGetAllGoals,
   //    { data: dataGetAllGoals, isFetching: isFetchingGetAllGoals, isLoading: isLoadingGetAllGoals }]
   //    = useLazyGetGoalsByAppraisalPeriodQuery();
   const allItems = items || selectedAppraisals;

   // Init Item
   // useEffect(() => {
   //    if (!dataGetAllGoals) return;
   //    dispatch(listChanged(dataGetAllGoals));
   // }, [dataGetAllGoals]);

   const isLoading = loading;
   const hasItems = allItems && allItems.length > 0;

   const getListLayout = (_layout: string) => {
      switch (_layout) {
         // case `groupedByUserAccordion`:
         //    return <GroupedByUserAccordion />;
         //    break;
         case `flatTable`:
            return allItems.map(item =>
               <AppraisalRowX item={item} key={`key-appraisal-${item.id}`} />
            );
            break;
         case `myFlatTable`:
            return allItems.map(item =>
               <MyAppraisalRow item={item} key={`key-appraisal-${item.id}`} />
            );
            break;
         default:
            return (
               <ErrorMessage message={`TODO-error-message`} messageDetails={`TODO-error-messageDetails`}>
                  <Text content={`TODO-error-children`} />
               </ErrorMessage>
            );
            break;
      }
   }

   return (
      <Flex fill gap="gap.small" column className={`mmt-appraisalList mmt-listView`}>
         {isLoading && <Loader message={t('entity.appraisal', { count: 0 })} />}
         {hasItems && getListLayout(layout)}
         {/* {!isLoading && !hasItems &&
            <Flex fill hAlign="center" className='mmt-rowGutter'>
               <Header as="h4" content={t('common:error.noItemsOfEntity', { entity: t('entity.appraisal', { count: 0 }).toLocaleLowerCase() })} />
            </Flex>
         } */}
      </Flex>
   );
}

export default AppraisalListX;