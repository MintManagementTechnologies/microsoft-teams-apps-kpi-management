import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Image, Segment, Text } from '@fluentui/react-northstar';

import { defaultAvatar } from '../../../../common/utils/commonVariables';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import {
    useLazyGetMultipleUsersWithPhotoAndPresenceQuery
} from '../../../../services/graphApiService';
import {
    INotificationData, useNotifyEmployeeMutation
} from '../../../../services/notificationService';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { useLazyGetEmployeeManagersQuery } from '../../../employees/employeeService';
import { useSubmitAppraisalForApprovalMutation } from '../../appraisalService';
import { formStateChanged } from '../../appraisalSlice';

const SubmitAppraisal = (props: { id: number, userId: number }): JSX.Element => {
   const { id, userId } = props;
   // const id = 928;
   // const userId = 111;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const [error, setError] = useState({
      show: false,
      message: '',
      details: ''
   });

   const [submitAppraisalForApproval, { isLoading, isError: isErrorSubmitAppraisal, error: errorSubmitAppraisal }]
      = useSubmitAppraisalForApprovalMutation();

   const loggedInUserId = useTypedSelector((state: RootState) => state.currentUser.id);
   const currentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);

   const [approvers, setApprovers] = useState<{
      order: number;
      displayName: string;
      image: string;
   }[]>([]);

   const [triggerNotifyEmployee,
      { data: dataNotifyEmployee, isLoading: isLoadingNotifyEmployee }]
      = useNotifyEmployeeMutation();

   const [triggerGetEmployeeManagers,
      { data: dataGetEmployeeManagers, isFetching: isFetchingGetEmployeeManagers, isLoading: isLoadingGetEmployeeManagers }]
      = useLazyGetEmployeeManagersQuery();

   const [triggerGetMultipleUsersWithPhotoAndPresence,
      { data: dataGetMultipleUsersWithPhotoAndPresence, isFetching: isFetchingGetMultipleUsersWithPhotoAndPresence, isLoading: isLoadingGetMultipleUsersWithPhotoAndPresence }]
      = useLazyGetMultipleUsersWithPhotoAndPresenceQuery();

   useEffect(() => {
      if (!currentEmployee || currentEmployee.id === 0 || currentEmployee.managers.length === 0) return;
      triggerGetEmployeeManagers(currentEmployee.managers.map(x => x.id));
   }, [currentEmployee]);

   useEffect(() => {
      if (!dataGetEmployeeManagers || dataGetEmployeeManagers.length === 0 || approvers.length > 0) return;
      setApprovers(dataGetEmployeeManagers.map((x, i) => ({
         order: i + 1,
         displayName: x.title,
         image: x.image || defaultAvatar,
      })));
      triggerGetMultipleUsersWithPhotoAndPresence(dataGetEmployeeManagers.map(x => x.upn));
   }, [dataGetEmployeeManagers]);

   useEffect(() => {
      if (!dataGetMultipleUsersWithPhotoAndPresence || dataGetMultipleUsersWithPhotoAndPresence.length === 0) return;
      setApprovers(dataGetMultipleUsersWithPhotoAndPresence.map((x, i) => ({
         order: i + 1,
         displayName: x.title,
         image: x.image || defaultAvatar,
      })));
   }, [dataGetMultipleUsersWithPhotoAndPresence]);

   // Update Error Message
   useEffect(() => {
      if (!isErrorSubmitAppraisal) return;
      setError({
         show: true,
         message: t('common:error.entityAction', {
            action: t(`common:button.submit`),
            entity: t('entity.goal', { count: 0 })
         }),
         details: JSON.stringify(errorSubmitAppraisal)
      });
   }, [isErrorSubmitAppraisal]);

   const handleOnSubmit = async (event: any) => {
      event.preventDefault();
      submitAppraisalForApproval({ id: id, userId: userId }).unwrap().then((result: any) => {
         debugger;
         if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success' || result.status.toLowerCase() === 'pending') {
            const notification: INotificationData = {
               recipients: [loggedInUserId],
               cardData: {
                  url: "https://teams.microsoft.com/l/entity/f21cf063-4b7a-457e-8e39-815ad2ec5687/myappraisals",
                  title: 'Your appraisal has been submitted for approval',
                  subtitle: 'Your line manager(s) will contact you for any queries',
                  approvers: approvers
               }
            }
            triggerNotifyEmployee(notification).unwrap().finally(() => {
               dispatch(formStateChanged('closeForm'));
            });
         } else if (result.status.toLowerCase() === 'failed') {
            setError({
               show: true,
               message: t('common:error.entityAction', {
                  action: t(`common:button.submit`),
                  entity: t('entity.goal', { count: 0 })
               }),
               details: result.message
            });
         } else {
            debugger;
         }
      });
   }

   const handleOnCancel = (event: any) => {
      event.preventDefault();
      dispatch(formStateChanged('closeForm'));
   }

   const handleOnErrorDismiss = () => {
      setError({
         show: false,
         message: '',
         details: ''
      });
   }

   const isError = error.show;
   if (isError) {
      return (
         <ErrorMessage message={error.message} messageDetails={error.details}
            onDismiss={handleOnErrorDismiss}
         />
      )
   }

   return (
      <>
         <Flex gap='gap.small' hAlign={'center'} vAlign={'center'} padding="padding.medium" column fill className='mmt-goalBatch-submit mmt-taskModule-headerAndBody'>
            <Flex hAlign={'center'} >
               <Image className="mmt-goalBatch-submit-image" src="/images/thumbsUp.png" fluid />
            </Flex>
            <Flex gap='gap.small' hAlign={'center'} column className='mmt-taskModule-header'>
               <Text content={`${t('modal.myAppraisals.submit.title')}`} color={`brand`} size="large" weight="bold" />
               <Text content={`${t('modal.myAppraisals.submit.description')}`} temporary size="small" />
            </Flex>
         </Flex>
         <Segment className={"mmt-footer-container"}>
            <Flex fill hAlign="end" gap="gap.small">
               <Button
                  content={t('common:button.cancel')}
                  onClick={(event) => handleOnCancel(event)}
               />
               <Button
                  content={t(`common:button.submit`)}
                  primary
                  onClick={(event) => handleOnSubmit(event)}
                  loading={isLoading}
                  disabled={isLoading}
               />
            </Flex>
         </Segment>
      </>
   );
}

export default SubmitAppraisal;