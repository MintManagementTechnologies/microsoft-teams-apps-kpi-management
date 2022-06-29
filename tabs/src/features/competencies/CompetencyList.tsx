import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';
import { useLazyGetCompetenciesByWorkgradeQuery } from './competencyService';
import { listChanged } from './competencySlice';
// import GroupedByYearAccordion from './parts/accordion/GroupedByYearAccordion';
import CompetencyRow from './parts/rowLayouts/CompetencyRow';
import { ICompetencyModel } from './types';

const CompetencyList = (props: { items?: ICompetencyModel[], layout?: string }): JSX.Element => {
   const { items } = props;
   const layout = props.layout || 'flatTable';
   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();
   const selectedWorkGrade = useTypedSelector((state: RootState) => state.workgrade.itemId);

   const [triggerGetAllCompetencies,
      { data: dataGetAllCompetencies, isFetching: isFetchingGetAllCompetencies, isLoading: isLoadingGetAllCompetencies }]
      = useLazyGetCompetenciesByWorkgradeQuery();

      // Init Item
      useEffect(() => {
         if (selectedWorkGrade > 0) {
            triggerGetAllCompetencies(selectedWorkGrade);
         }
      }, [selectedWorkGrade]);
   
      // Init Item
      useEffect(() => {
         if (!dataGetAllCompetencies) return
         dispatch(listChanged(dataGetAllCompetencies));
      }, [dataGetAllCompetencies]);

   const allItems = items || dataGetAllCompetencies;
   
   const isLoading = isLoadingGetAllCompetencies || isFetchingGetAllCompetencies;
   const hasItems = !isLoading && allItems && allItems.length > 0;
   
   const isError = !(hasItems || isLoading);
   if (isError) {
      return (<ErrorMessage message={t('common:error.noItemsOfEntity', { entity: t('entity.competency', { count: 0 }).toLocaleLowerCase() })}/>)
   }

   const getListLayout = (_layout: string) => {
      switch (_layout) {
         // case `groupedByYearAccordion`:
         //    return <GroupedByYearAccordion />;
         //    break;
         case `flatTable`:
            return allItems?.map(item =>
               <CompetencyRow item={item} key={`key-competency-${item.id}`} />
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
         {isLoading && <Loader message={t('entity.competency', { count: 0 })} />}
         {hasItems && getListLayout(layout)}
      </Flex>
   );
}

export default CompetencyList;