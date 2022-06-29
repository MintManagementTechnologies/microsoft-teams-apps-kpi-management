import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { getLocaleDate } from '../../../../common/utils/sharedFunctions';
import Loader from '../../../../components/common/Loader';
import { useAppDispatch } from '../../../../store';
import Appraisal from '../../Appraisal';
import { useGetGoalForAppraisalQuery } from '../../appraisalService';
import { sliceChanged } from '../../appraisalSlice';
import { IAppraisalSearchModel, newAppraisal } from '../../types';

const AppraisalForm = (props: { displayMode?: string, searchModel?: IAppraisalSearchModel }): JSX.Element => {
   const { searchModel } = props;
   const displayMode = props.displayMode || 'view';
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const { data: dataGetAppraisal, isFetching: isFetchingGetAppraisal, isLoading: isLoadingGetAppraisal }
      = useGetGoalForAppraisalQuery(searchModel || skipToken);

   // Init Item
   useEffect(() => {
      dispatch(sliceChanged({ item: dataGetAppraisal || newAppraisal, formState: displayMode }));
   }, [dataGetAppraisal]);

   const item = dataGetAppraisal || newAppraisal;
   const isLoading = isLoadingGetAppraisal || isFetchingGetAppraisal;
   return (
      <Flex gap='gap.small' padding="padding.medium" column fill>
         <Flex gap='gap.small' column fill className='mmt-taskModule-header'>
            <Flex column fill >
               <Text content={`${t('modal.myAppraisals.appraisal.title')}`} color={`brand`} size="large" weight="bold" />
               <Text content={`${getLocaleDate(new Date().getTime())}`} timestamp size="small" />
            </Flex>
            <Text content={`${t('modal.myAppraisals.appraisal.description')}`} size="small" />
         </Flex>
         {isLoading ? <Loader message={t('entity.appraisal', { count: 1 })} />
            :
            <Appraisal
               displayMode={displayMode as any}
               item={item}
            />
         }
      </Flex>
   );
}

export default AppraisalForm;