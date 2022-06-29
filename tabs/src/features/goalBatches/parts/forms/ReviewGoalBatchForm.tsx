import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import {
    Button, Flex, FormCheckbox, FormTextArea, Input, Segment, Text, TextArea
} from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { defaultAvatar } from '../../../../common/utils/commonVariables';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import Loader from '../../../../components/common/Loader';
import {
    useLazyGetMultipleUsersWithPhotoAndPresenceQuery
} from '../../../../services/graphApiService';
import {
    INotificationData, useNotifyEmployeeMutation, useSendMessageMutation
} from '../../../../services/notificationService';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import {
    useLazyGetEmployeeByIdQuery, useLazyGetEmployeeManagersQuery
} from '../../../employees/employeeService';
import { useGetGoalsByBatchIdQuery } from '../../../goals/goalService';
import { useApproveGoalBatchMutation } from '../../goalBatchService';
import { formResultChanged, formStateChanged } from '../../goalBatchSlice';

export interface IApprovalOutcome {
   id: number;
   userId: number;
   approved: boolean;
   comment: string;
}

const ReviewGoalBatchForm = (props: {
   id: number,
   currentApproverId: number,
   defaultOutcome: 'approve' | 'reject' | string,
}): JSX.Element => {
   const { id, currentApproverId, defaultOutcome } = props;
   const approved = defaultOutcome === 'approve';

   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const [comments, setComments] = useState('');
   const [postAction, setPostAction] = useState('');
   const [error, setError] = useState({
      show: false,
      message: '',
      details: ''
   });

   const [approveGoalBatch, { isLoading, isError: isErrorApproveGoalBatch, error: errorApproveGoalBatch }]
      = useApproveGoalBatchMutation();

   const [recipients, setRecipients] = useState<string[]>([]);

   const [approvers, setApprovers] = useState<{
      order: number;
      displayName: string;
      image: string;
   }[]>([]);

   const [triggerNotifyEmployee,
      { data: dataNotifyEmployee, isLoading: isLoadingNotifyEmployee }]
      = useNotifyEmployeeMutation();

   const [triggerSendMessage,
      { data: dataSendMessage, isLoading: isLoadingSendMessage }]
      = useSendMessageMutation();

   const { data: dataGetGoalsByBatchId, isFetching: isFetchingGetGoalsByBatchId, isLoading: isLoadingGetGoalsByBatchId }
      = useGetGoalsByBatchIdQuery(id || skipToken);

   const [triggerGetEmployeeById,
      { data: dataGetEmployeeById, isFetching: isFetchingGetEmployeeById, isLoading: isLoadingGetEmployeeById }]
      = useLazyGetEmployeeByIdQuery();

   const [triggerGetEmployeeManagers,
      { data: dataGetEmployeeManagers, isFetching: isFetchingGetEmployeeManagers, isLoading: isLoadingGetEmployeeManagers }]
      = useLazyGetEmployeeManagersQuery();

   const [triggerGetMultipleUsersWithPhotoAndPresence,
      { data: dataGetMultipleUsersWithPhotoAndPresence, isFetching: isFetchingGetMultipleUsersWithPhotoAndPresence, isLoading: isLoadingGetMultipleUsersWithPhotoAndPresence }]
      = useLazyGetMultipleUsersWithPhotoAndPresenceQuery();

   useEffect(() => {
      if (!dataGetGoalsByBatchId || dataGetGoalsByBatchId.length === 0) return;
      const userId = dataGetGoalsByBatchId[0].userId;
      triggerGetEmployeeById(userId);
   }, [dataGetGoalsByBatchId]);

   useEffect(() => {
      if (!dataGetEmployeeById || dataGetEmployeeById.id === 0 || dataGetEmployeeById.managers.length === 0) return;
      setRecipients([dataGetEmployeeById.upn.trim()]);
      triggerGetEmployeeManagers(dataGetEmployeeById.managers.map(x => x.id));
   }, [dataGetEmployeeById]);

   useEffect(() => {
      if (!dataGetEmployeeManagers || dataGetEmployeeManagers.length === 0 || approvers.length > 0) return;
      setApprovers(dataGetEmployeeManagers.map((x, i) => ({
         order: i + 1,
         displayName: x.title,
         image: x.image || defaultAvatar,
      })));
      triggerGetMultipleUsersWithPhotoAndPresence(dataGetEmployeeManagers.map(x => x.upn.trim()));
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
      if (!isErrorApproveGoalBatch) return;
      setError({
         show: true,
         message: t('common:error.entityAction', {
            action: t(`common:button.${defaultOutcome}`),
            entity: t('entity.goal', { count: 0 })
         }),
         details: JSON.stringify(errorApproveGoalBatch)
      });
   }, [isErrorApproveGoalBatch]);

   const handleOnSubmit = async (event: any) => {
      event.preventDefault();
      const approveModel = {
         id: id,
         approverId: currentApproverId,
         comments: comments,
         approved: approved
      };
      approveGoalBatch(approveModel).unwrap().then((result: any) => {
         if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success' || result.status.toLowerCase() === 'pending') {
            if (approved) {
               const notification: INotificationData = {
                  recipients: recipients,
                  cardData: {
                     title: `Your goals have been approved`,
                     url: "https://teams.microsoft.com/l/entity/f21cf063-4b7a-457e-8e39-815ad2ec5687/mygoals",
                     subtitle: 'Your line manager(s) will contact you for any queries',
                     approvers: approvers
                  }
               }
               triggerNotifyEmployee(notification).unwrap().finally(() => {
                  if (postAction === 'meeting') {
                     dispatch(formResultChanged(`callbackMeeting`));
                     dispatch(formStateChanged('closeForm'));
                  } else if (postAction === 'groupChat') {
                     dispatch(formResultChanged(`callbackGroupChat`));
                     dispatch(formStateChanged('closeForm'));
                  } else {
                     dispatch(formResultChanged(`callback`));
                     dispatch(formStateChanged('closeForm'));
                  }
               });
            } else {
               const notification = {
                  recipients: recipients,
                  messageData: {
                     title: `Your goals have been rejected`,
                     description: comments
                  }
               }
               triggerSendMessage(notification).unwrap().finally(() => {
                  if (postAction === 'meeting') {
                     dispatch(formResultChanged(`callbackMeeting`));
                     dispatch(formStateChanged('closeForm'));
                  } else if (postAction === 'groupChat') {
                     dispatch(formResultChanged(`callbackGroupChat`));
                     dispatch(formStateChanged('closeForm'));
                  } else {
                     dispatch(formResultChanged(`callback`));
                     dispatch(formStateChanged('closeForm'));
                  }
               });
            }
         } else if (result.status.toLowerCase() === 'failed') {
            setError({
               show: true,
               message: t('common:error.entityAction', {
                  action: t(`common:button.${defaultOutcome}`),
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
         {isLoading ? <Loader /> :
            <>
               <Flex column fill gap="gap.small" className={`mmt-taskModule-body mmt-inputForm`} >
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-textArea-comments`}>
                     <FormTextArea
                        label={t('form.comments.label')}
                        placeholder={t('form.comments.placeholder', { outcome: defaultOutcome })}
                        name="approve-comments"
                        fluid
                        className="mmt-textArea mmt-textArea-200"
                        onChange={(event, ctrl) => {
                           let updatedComments = ctrl?.value || '';
                           setComments(updatedComments);
                        }}
                     />
                  </Flex>
                  {/* <Flex hAlign='end' fill className={`mmt-inputGroup mmt-checkbox-teamsCommunication`}> */}
                  <Flex hAlign='end' fill className={`mmt-checkbox-teamsCommunication`}>
                     <FormCheckbox
                        id="cb-startConversation"
                        label={`${t('form.startConversation.label')}`}
                        checked={postAction === 'groupChat'}
                        onChange={(event, ctrl) => setPostAction(ctrl?.checked ? 'groupChat' : '')}
                     />
                     <FormCheckbox
                        id="cb-initiateMeeting"
                        label={`${t('form.initiateMeeting.label')}`}
                        checked={postAction === 'meeting'}
                        onChange={(event, ctrl) => setPostAction(ctrl?.checked ? 'meeting' : '')}
                     />
                  </Flex>
               </Flex>
               <Segment className={"mmt-footer-container"}>
                  <Flex fill hAlign="end" gap="gap.small">
                     <Button
                        content={t('common:button.cancel')}
                        onClick={(event) => handleOnCancel(event)}
                     />
                     <Button
                        content={t(`common:button.${defaultOutcome}`)}
                        primary
                        disabled={(defaultOutcome === 'reject' && comments.length < 2) || isLoading}
                        onClick={(event) => handleOnSubmit(event)}
                        loading={isLoading}
                     />
                  </Flex>
               </Segment>
            </>
         }
      </>
   );
}

export default ReviewGoalBatchForm;
