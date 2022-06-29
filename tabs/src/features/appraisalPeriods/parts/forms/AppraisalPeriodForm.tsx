import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { getLocaleDate } from '../../../../common/utils/sharedFunctions';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import Loader from '../../../../components/common/Loader';
import { useAppDispatch } from '../../../../store';
import AppraisalPeriod from '../../AppraisalPeriod';
import { useGetAppraisalPeriodQuery } from '../../appraisalPeriodService';
import { sliceChanged } from '../../appraisalPeriodSlice';
import { newAppraisalPeriod } from '../../types';

const AppraisalPeriodForm = (props: { displayMode?: string, id?: number }): JSX.Element => {
   const { id } = props;
   const displayMode = props.displayMode || 'view';
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const { data: dataGetAppraisalPeriod, isFetching: isFetchingGetAppraisalPeriod, isLoading: isLoadingGetAppraisalPeriod }
      = useGetAppraisalPeriodQuery(id || skipToken);

   // Init Item
   useEffect(() => {
      dispatch(sliceChanged({ item: dataGetAppraisalPeriod || newAppraisalPeriod, formState: displayMode }));
   }, [dataGetAppraisalPeriod]);

   const item = dataGetAppraisalPeriod || newAppraisalPeriod;
   const isLoading = isLoadingGetAppraisalPeriod || isFetchingGetAppraisalPeriod;
   return (
      <Flex gap='gap.small' padding="padding.medium" column fill className='mmt-taskModule-headerAndBody'>
         <Flex gap='gap.small' column className='mmt-taskModule-header'>
            <Flex column fill >
               {/* <Text content={`${t('modal.hrAdmin.period.title')}`} color={`brand`} size="large" weight="bold" /> */}
               <Text content={`${getLocaleDate(new Date().getTime())}`} timestamp size="small" />
            </Flex>
            {/* <Text content={`${t('modal.hrAdmin.period.description')}`} size="small" /> */}
         </Flex>
         {isLoading ? <Loader message={t('entity.appraisalPeriod', { count: 1 })} />
            :
            <AppraisalPeriod
               displayMode={displayMode as any}
               item={item}
            />
         }
      </Flex>
   );
}

export default AppraisalPeriodForm;