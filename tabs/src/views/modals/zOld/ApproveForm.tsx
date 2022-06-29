import * as React from 'react';
import { useState } from 'react';
import { Button, Flex, Form, FormCheckbox, FormTextArea, Loader, Segment, Text } from '@fluentui/react-northstar';
import { useTranslation } from 'react-i18next';

export interface IApprovalOutcome {
   comments: string;
   outcome: 'approve' | 'reject' | string;
   startConversation: boolean;
   initiateMeeting: boolean;
}

const ApproveForm = (props: {
   defaultApprovalOutcome: IApprovalOutcome,
   isLoading: boolean,
   viewingOnly?: boolean,
   onSubmit: (_comments: string, _startConversation: boolean, _initiateMeeting: boolean) => Promise<void>
}): JSX.Element => {
   const { t } = useTranslation();
   const { defaultApprovalOutcome, isLoading, viewingOnly, onSubmit } = props;
   const viewModeClass = viewingOnly ? 'mmt-viewingOnly' : '';

   const [comments, setComments] = useState(defaultApprovalOutcome.comments);
   const [startConversation, setStartConversation] = useState(defaultApprovalOutcome.startConversation);
   const [initiateMeeting, setInitiateMeeting] = useState(defaultApprovalOutcome.initiateMeeting);

   const handleOnSubmit = async (event: any) => {
      event.preventDefault();
      onSubmit(comments, startConversation, initiateMeeting);
      //microsoftTeams.tasks.submitTask("refresh");
   }

   const handleOnCancel = (event: any) => {
      event.preventDefault();
      microsoftTeams.tasks.submitTask("cancel");
   }

   return (
      <>
         {(isLoading) ?
            (<Flex hAlign='center' fill><Loader label={t('Loading')} /></Flex>)
            :
            (<>
               <Form
                  onSubmit={(event) => handleOnSubmit(event)}
                  className={`mmt-taskModule-body ${viewModeClass}`}
               >

                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-textArea-comments`}>
                     <FormTextArea
                        label={t('form.comments.label')}
                        placeholder={t('form.comments.placeholder', {outcome: defaultApprovalOutcome.outcome})}
                        name="approve-comments"
                        fluid
                        className="mmt-textArea mmt-textArea-200"
                        defaultValue={defaultApprovalOutcome.comments}
                        onChange={(event, ctrl) => {
                           let updatedComments = ctrl?.value || '';
                           setComments(updatedComments);
                        }}
                        disabled={viewingOnly}
                     />
                  </Flex>
                  {/* <Flex hAlign='end' fill className={`mmt-inputGroup mmt-checkbox-teamsCommunication`}> */}
                  <Flex hAlign='end' fill className={`mmt-checkbox-teamsCommunication`}>
                     <FormCheckbox
                        id="cb-startConversation"
                        label={`${t('form.startConversation.label')}`}
                        disabled={viewingOnly}
                        checked={startConversation}
                        onChange={(event, ctrl) => setStartConversation(ctrl?.checked || false)}
                     />
                     <FormCheckbox
                        id="cb-initiateMeeting"
                        label={`${t('form.initiateMeeting.label')}`}
                        disabled={viewingOnly}
                        checked={initiateMeeting}
                        onChange={(event, ctrl) => setInitiateMeeting(ctrl?.checked || false)}
                     />
                  </Flex>
               </Form>
               <Segment className={"mmt-footer-container"}>
                  <Flex fill hAlign="end" gap="gap.small">
                     <Button
                        content={t('common:button.cancel')}
                        onClick={(event) => handleOnCancel(event)}
                     />
                     <Button
                        content={t(`common:button.${defaultApprovalOutcome.outcome}`)}
                        primary
                        disabled={viewingOnly || (defaultApprovalOutcome.outcome === 'reject' && comments.length < 2)}
                        onClick={(event) => handleOnSubmit(event)}
                     />
                  </Flex>
               </Segment>
            </>
            )}
      </>
   );
}

export default ApproveForm;