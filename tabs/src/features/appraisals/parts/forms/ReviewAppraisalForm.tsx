import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, FormCheckbox, FormTextArea, Segment } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { defaultAvatar } from '../../../../common/utils/commonVariables';
import { getDefaultStartAndEndTimes } from '../../../../common/utils/sharedFunctions';
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
import { useSaveAppraisalReviewMutation } from '../../appraisalService';
import { formResultChanged, formStateChanged } from '../../appraisalSlice';
import { IAppraisalReviewModel } from '../../types';

const ReviewAppraisalForm = (props: {
   id: number,
   currentReviewerId: number,
   currentLevel: number,
}): JSX.Element => {
   const { id, currentReviewerId, currentLevel } = props;

   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const [comments, setComments] = useState('');
   const [postAction, setPostAction] = useState('');
   const [error, setError] = useState({
      show: false,
      message: '',
      details: ''
   });
   
   const [saveAppraisalReview, { isLoading: isLoadingSaveAppraisalReview, isError: isErrorSaveAppraisalReview, error: errorSaveAppraisalReview }]
      = useSaveAppraisalReviewMutation();

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
      if (!isErrorSaveAppraisalReview) return;
      setError({
         show: true,
         message: t('common:error.entityAction', {
            action: t(`common:button.approve`),
            entity: t('entity.appraisal', { count: 1 })
         }),
         details: JSON.stringify(errorSaveAppraisalReview)
      });
   }, [isErrorSaveAppraisalReview]);

   const handleOnSubmit = async (event: any, _outcome: boolean) => {
      event.preventDefault();
      const reviewModel: IAppraisalReviewModel = {
         id: id,
         comments: comments,
         approved: _outcome,
         userId: currentReviewerId,
         upn: '',
         order: currentLevel,
         outcome: _outcome ? 1 : 0,
      };
      saveAppraisalReview(reviewModel).unwrap().then((result: any) => {
         if (result.status.toLowerCase() === 'completed' || result.status.toLowerCase() === 'success' || result.status.toLowerCase() === 'pending') {
            if (_outcome) {
               const notification: INotificationData = {
                  recipients: recipients,
                  cardData: {
                     title: `Your appraisal has been approved`,
                     url: "https://teams.microsoft.com/l/entity/f21cf063-4b7a-457e-8e39-815ad2ec5687/myappraisals",
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
                     title: `Your appraisal has been rejected`,
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
            // const notification: INotificationData = {
            //    recipients: [loggedInUserId],
            //    cardData: {
            //       title: `Your appraisal has been ${_outcome ? ' approved' : 'rejected'}`,
            //       subtitle: 'Your line manager(s) will contact you for any queries',
            //       approvers: [{
            //          order: 1,
            //          displayName: "Werner Beytel",
            //          image: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAwADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+vLfihBNrPinw3oEDPEZvMlkdTj5OAT+ADfmK9SrzrxXb3E/xH0m606S3a6gsriPZMxC7vlIDY5xhyeOu3FZ1fgZdP4jcj02whjEcdjbKgUKB5K9B0zxzWN4wkNlb6VqcJ2XVrqVusbDjKu2x0PsQentVCy1zWZPFi6VdapohwrK9vbQyeZv2kryxI7Zx6VhzalqPiHTJjNrGn3f2KSK5e2t7N4v9VKN7K7H5gMNn+lcUU1JO51O1j22ioLO8t7+1S5tZVlhf7rr0NT16JxBXmkjzjxoJ7hQsr38kQyOTHtIXn6Bfz969LrkfHOjo+mPrlrDI2paeUuEEZP7wI2SCvf5d3vWVWDlHQ0pSUXqRLpGk2WofbVRYJXGHG7iQA9cHv8AN1HPNOsNJ060R4o7e3aTpLtAb8/fgZ964nWnuvFM0stpqfk2bxqI4kXqCobn5STyT+XTvTtJn1vw+GuLnVkuNNtzH9oilgKnDNgBWIB3d+ewris+XVnVbXY7vwKPJ0/ULJYTHFaX0kKcYBAxjH4Y/HNdVXJfDlpbjwmL+bPmX11Pcn/gTnH6AV1tehBWijjm/eYVTh1K2ur2W0hLSGIHzHC/ID/dz0z7VS1a51W1vIjZrC9s6hXEjAFSW+8MnnqOK4vxR4+u/COqvplraLf3LxeZNKxKpHK33QFHbaMkcckVoot7EnN+JLOX4d+Ipvs/k3mj36M62LctCoPIx1UDcQrD6dqw77X9Mfw9LoeiwzeTdziZmuJvMctxhc/UCqNjreot4xXW9RR7qWWULOGXG5DwVHoAOnoQK9bk0bRri6u9LhhtVuLnT3KPHEAziQ+Xk8cFecj3zWFbD8sl5m8KvunY6JYDS9CsLAKq/Z7dIyF6ZAGf1q/Xz34f8deJvCMk+myIb63gZohDcbvkIJHyt1AyOnI9MV7R4Q1q48QeFrLUbqDybiRSJFCkAspIJGexxmuiVNxV+hhc/9k="
            //       },
            //       {
            //          order: 2,
            //          displayName: "Abrie van Wyk",
            //          image: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAwADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+vLfihBNrPinw3oEDPEZvMlkdTj5OAT+ADfmK9SrzrxXb3E/xH0m606S3a6gsriPZMxC7vlIDY5xhyeOu3FZ1fgZdP4jcj02whjEcdjbKgUKB5K9B0zxzWN4wkNlb6VqcJ2XVrqVusbDjKu2x0PsQentVCy1zWZPFi6VdapohwrK9vbQyeZv2kryxI7Zx6VhzalqPiHTJjNrGn3f2KSK5e2t7N4v9VKN7K7H5gMNn+lcUU1JO51O1j22ioLO8t7+1S5tZVlhf7rr0NT16JxBXmkjzjxoJ7hQsr38kQyOTHtIXn6Bfz969LrkfHOjo+mPrlrDI2paeUuEEZP7wI2SCvf5d3vWVWDlHQ0pSUXqRLpGk2WofbVRYJXGHG7iQA9cHv8AN1HPNOsNJ060R4o7e3aTpLtAb8/fgZ964nWnuvFM0stpqfk2bxqI4kXqCobn5STyT+XTvTtJn1vw+GuLnVkuNNtzH9oilgKnDNgBWIB3d+ewris+XVnVbXY7vwKPJ0/ULJYTHFaX0kKcYBAxjH4Y/HNdVXJfDlpbjwmL+bPmX11Pcn/gTnH6AV1tehBWijjm/eYVTh1K2ur2W0hLSGIHzHC/ID/dz0z7VS1a51W1vIjZrC9s6hXEjAFSW+8MnnqOK4vxR4+u/COqvplraLf3LxeZNKxKpHK33QFHbaMkcckVoot7EnN+JLOX4d+Ipvs/k3mj36M62LctCoPIx1UDcQrD6dqw77X9Mfw9LoeiwzeTdziZmuJvMctxhc/UCqNjreot4xXW9RR7qWWULOGXG5DwVHoAOnoQK9bk0bRri6u9LhhtVuLnT3KPHEAziQ+Xk8cFecj3zWFbD8sl5m8KvunY6JYDS9CsLAKq/Z7dIyF6ZAGf1q/Xz34f8deJvCMk+myIb63gZohDcbvkIJHyt1AyOnI9MV7R4Q1q48QeFrLUbqDybiRSJFCkAspIJGexxmuiVNxV+hhc/9k="
            //       }]
            //    }
            // }
            // triggerNotifyEmployee(notification).unwrap().finally(() => {
            //    if (postAction === 'meeting') {
            //       dispatch(formResultChanged(`callbackMeeting`));
            //       dispatch(formStateChanged('closeForm'));
            //    } else if (postAction === 'groupChat') {
            //       dispatch(formResultChanged(`callbackGroupChat`));
            //       dispatch(formStateChanged('closeForm'));
            //    } else {
            //       dispatch(formResultChanged(`callback`));
            //       dispatch(formStateChanged('closeForm'));
            //    }
            // });
         } else if (result.status.toLowerCase() === 'failed') {
            setError({
               show: true,
               message: t('common:error.entityAction', {
                  action: t(`common:button.approve`),
                  entity: t('entity.appraisal', { count: 1 })
               }),
               details: result.message
            });
         } else {
            debugger;
         }
      }).catch(err => {
         debugger;
      });
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

   const isLoading = isLoadingSaveAppraisalReview;
   return (
      <>
         {isLoading ? <Loader /> :
            <>
               <Flex column fill gap="gap.small" className={`mmt-taskModule-body mmt-inputForm`} >
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-textArea-comments`}>
                     <FormTextArea
                        label={t('form.appraisalReview.comments.label')}
                        placeholder={t('form.appraisalReview.comments.placeholder')}
                        name="approve-comments"
                        fluid
                        className="mmt-textArea mmt-textArea-200"
                        onChange={(event, ctrl) => {
                           let updatedComments = ctrl?.value || '';
                           setComments(updatedComments);
                        }}
                     />
                  </Flex>
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
                        content={t('common:button.reject')}
                        disabled={comments.length < 2 || isLoading}
                        loading={isLoading}
                        onClick={(event) => handleOnSubmit(event, false)}
                     />
                     <Button
                        content={t(`common:button.approve`)}
                        primary
                        disabled={isLoading}
                        loading={isLoading}
                        onClick={(event) => handleOnSubmit(event, true)}
                     />
                  </Flex>
               </Segment>
            </>
         }
      </>
   );
}

export default ReviewAppraisalForm;
