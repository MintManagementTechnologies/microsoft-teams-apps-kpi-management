import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Header, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Gallery from '../../components/layouts/gallery/Gallery';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';
import { useLazyGetGoalsByAppraisalPeriodQuery } from './goalService';
import { listChanged } from './goalSlice';
import GroupedByKraAccordion from './parts/accordion/GroupedByKraAccordion';
import GroupedByUserAccordion from './parts/accordion/GroupedByUserAccordion';
import GoalCard from './parts/goalCard/GoalCard';
import GoalRow from './parts/rowLayouts/GoalRow';
import { IGoalModel } from './types';

const GoalList = (props: { items?: IGoalModel[], layout?: string, userId?: number, loading?: boolean }): JSX.Element => {
   const { items, userId, loading } = props;
   const layout = props.layout || 'groupedByUserAccordion';
   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedGoals = useTypedSelector((state: RootState) => state.goal.list);
   const selectedFormState = useTypedSelector((state: RootState) => state.goal.formState);

   const [triggerGetAllGoals,
      { data: dataGetAllGoals, isFetching: isFetchingGetAllGoals, isLoading: isLoadingGetAllGoals }]
      = useLazyGetGoalsByAppraisalPeriodQuery();
   const allItems = items || selectedGoals;

   // Init Item
   useEffect(() => {
      if (!dataGetAllGoals) return;
      dispatch(listChanged(dataGetAllGoals));
   }, [dataGetAllGoals]);

   const isLoading = isLoadingGetAllGoals || isFetchingGetAllGoals || loading;
   const hasItems = allItems && allItems.length > 0;

   const renderCardArray = () => {
      let UIitems: Array<JSX.Element> = [];
      if (selectedGoals.length !== 0) {
         UIitems = selectedGoals.map(x =>
            <GoalCard
               key={`card-${x.id}`}
               item={x}
               displayMode={selectedFormState}
            />
         )
      }
      return UIitems as any[];
   }

   const getListLayout = (_layout: string) => {
      switch (_layout) {
         case `groupedByUserAccordion`:
            return <GroupedByUserAccordion />;
            break;
         case `groupedByKraAccordion`:
            return <GroupedByKraAccordion userId={userId} />;
            break;
         case `cards`:
            return <Flex padding={'padding.medium'} column><Gallery items={renderCardArray()} /></Flex>;
            break;
         case `flatTable`:
            return allItems.map(item =>
               <GoalRow item={item} key={`key-goal-${item.id}`} displayMode={selectedFormState} />
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
      <Flex fill gap="gap.small" column>
         {isLoading && <Loader message={t('entity.goal', { count: 0 })} />}
         {(!isLoading && hasItems) && getListLayout(layout)}
      </Flex>
   );
}

export default GoalList;