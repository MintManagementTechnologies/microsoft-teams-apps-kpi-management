import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { getLocaleDate } from '../../../../common/utils/sharedFunctions';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import Loader from '../../../../components/common/Loader';
import { useAppDispatch } from '../../../../store';
import Competency from '../../Competency';
import { useGetCompetencyQuery } from '../../competencyService';
import { sliceChanged } from '../../competencySlice';
import { newCompetency } from '../../types';

const CompetencyForm = (props: { displayMode?: string, id?: number }): JSX.Element => {
   const { id } = props;
   const displayMode = props.displayMode || 'view';
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const { data: dataGetCompetency, isFetching: isFetchingGetCompetency, isLoading: isLoadingGetCompetency }
      = useGetCompetencyQuery(id || skipToken);

   // Init Item
   useEffect(() => {
      dispatch(sliceChanged({ item: dataGetCompetency || newCompetency, formState: displayMode }));
   }, [dataGetCompetency]);

   const item = dataGetCompetency || newCompetency;
   const isLoading = isLoadingGetCompetency || isFetchingGetCompetency;
   return (
      <Flex gap='gap.small' padding="padding.medium" column fill className='mmt-taskModule-headerAndBody'>
         {isLoading ? <Loader message={t('entity.competency', { count: 1 })} />
            :
            <Competency
               displayMode={displayMode as any}
               item={item}
            />
         }
      </Flex>
   );
}

export default CompetencyForm;