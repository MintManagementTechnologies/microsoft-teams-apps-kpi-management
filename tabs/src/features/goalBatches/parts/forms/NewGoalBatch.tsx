import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, EditIcon, Flex, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../../../components/common/ErrorMessage';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { useCreateGoalBatchMutation } from '../../goalBatchService';
import { sliceChanged } from '../../goalBatchSlice';
import { IGoalBatchModel } from '../../types';

const NewGoalBatch = (props: { appraisalPeriodId: number }): JSX.Element => {
   const { appraisalPeriodId } = props;
   const [errorMessage, setErrorMessage] = useState(``);

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);

   const [createGoalBatch, { isLoading: isLoadingCreateGoal }] = useCreateGoalBatchMutation();

   const handleOnCreate = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      await createGoalBatch({ ...selectedCurrentEmployee, appraisalPeriodId: appraisalPeriodId }).unwrap().then((result) => {
         // if (result.status === 'FAILED') {
         //    setErrorMessage(result.message);
         // } else {
         //    setErrorMessage('');
         //    dispatch(itemAdded(result.appraisaltitle[0]));
         // }
         // TODO: Need an example to create a goalBatch
         const tmpItem = {
            id: result.appraisaltitle.length > 0 ? result.appraisaltitle[0].id : -1, 
            title: "NA",
            status: "draft",
            userId: selectedCurrentEmployee.id,
            appraisalPeriodId: appraisalPeriodId,
            createdTimestamp: new Date().getTime(),
         };
         dispatch(sliceChanged({ item: tmpItem, triggerApi: true }));
      })
   }

   //TODO error Checking
   const isError = errorMessage.length > 0;
   if (isError) {
      return (
         <Flex padding={'padding.medium'} fill column>
            <ErrorMessage message={errorMessage} />
         </Flex>
      )
   }

   return (
      <Flex column fill gap={`gap.small`} hAlign="center" padding={'padding.medium'} >
         <Text content={`You have not registered for the selected appraisal period.`} weight={'semibold'} size={`large`} />
         <Text content={`Would you like to register now?`} />
         <Button primary content={`Register`} onClick={handleOnCreate} loading={isLoadingCreateGoal} disabled={isLoadingCreateGoal} />
      </Flex>
   );
}

export default NewGoalBatch;