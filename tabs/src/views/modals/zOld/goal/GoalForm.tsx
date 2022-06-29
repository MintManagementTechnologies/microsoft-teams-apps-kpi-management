import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import {
    Button, Flex, Form, FormDropdown, FormInput, FormLabel, FormTextArea, Input, Loader, Segment
} from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';

import mockKRAs from '../../../../common/mockData/mockKRAs';
import { upperFirstLetter } from '../../../../common/utils/sharedFunctions';
import { IGoalModel } from '../../../../features/goalsOld/types';

const GoalForm = (props: {
   goal: IGoalModel,
   isLoading: boolean,
   crudOperation?: 'create' | 'details' | 'edit' | 'delete',
   onSubmit: (_newGoal: Partial<IGoalModel>) => Promise<void>
}): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { goal, isLoading, crudOperation } = props;
   const viewingOnly = crudOperation === 'details';
   const submitBtnContent = crudOperation || 'submit';
   
   const [goalState, setGoalState] = useState(goal);
   const handleOnSubmit = async (event: any) => {
      event.preventDefault();
      microsoftTeams.tasks.submitTask("refresh");
   }

   const handleOnCancel = (event: any) => {
      event.preventDefault();
      microsoftTeams.tasks.submitTask("cancel");
   }

   const handleMultiInputChange = (event: any, keyValuePair: { field: string, value: any }[]) => {
      if (event !== null) event.preventDefault();

      let item = { ...goal };
      keyValuePair.forEach(x => {
         //@ts-ignore
         item[x.field] = x.value;
      });
      setGoalState(item);
      //validateForm();
   }

   const kraOptions = mockKRAs.map((x) => ({
      key: x.id,
      header: x.title,
      content: x.description
   }));

   const viewModeClass = viewingOnly ? 'mmt-viewingOnly' : '';
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
                  <Row className="mmt-inputGroup-row mmt-row-kra" xl={1} lg={1} md={1} sm={1} >
                     <Col key={`col-form-kra`} className={`mmt-inputGroup-col`}>
                        <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-kra`}>
                           <FormDropdown
                              label={t('formLabel-kra')}
                              fluid
                              key={`dropdown-kra`}
                              items={kraOptions}
                              defaultValue={kraOptions.find(
                                 (option) => option.key === goal.kraId
                              )}
                              onChange={
                                 (event, { value }: { value?: any }) =>
                                    handleMultiInputChange(event, [
                                       { field: `kraId`, value: value ? value.key : "-1" },
                                       { field: `kraTitle`, value: value ? value.header : "-header" },
                                    ])
                              }
                              disabled={viewingOnly}
                           />
                        </Flex>
                     </Col>
                  </Row>
                  <Row className="mmt-inputGroup-row mmt-row-description" xl={1} lg={1} md={1} sm={1} >
                     <Col key={`col-form-description`} className={`mmt-inputGroup-col`}>
                        <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-textArea-description`}>
                           <FormTextArea
                              label={t('formLabel-goalDescription')}
                              placeholder={t('formPlaceholder-goalDescription')}
                              name="goal-description"
                              fluid
                              className="mmt-textArea mmt-textArea-50"
                              defaultValue={goal.description}
                              onChange={(event, ctrl) =>
                                 handleMultiInputChange(event,
                                    [{ field: `description`, value: ctrl?.value }])
                              }
                              disabled={viewingOnly}
                           />
                        </Flex>
                     </Col>
                  </Row>
                  <Row className="mmt-inputGroup-row mmt-row-measureOfSuccess" xl={1} lg={1} md={1} sm={1} >
                     <Col key={`col-form-measureOfSuccess`} className={`mmt-inputGroup-col`}>
                        <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-textArea-measureOfSuccess`}>
                           <FormTextArea
                              label={t('formLabel-measureOfSuccess')}
                              placeholder={t('formPlaceholder-measureOfSuccess')}
                              name="goal-measureOfSuccess"
                              fluid
                              className="mmt-textArea mmt-textArea-50"
                              defaultValue={goal.measureOfSuccess}
                              onChange={(event, ctrl) =>
                                 handleMultiInputChange(event,
                                    [{ field: `measureOfSuccess`, value: ctrl?.value }])
                              }
                              disabled={viewingOnly}
                           />
                        </Flex>
                     </Col>
                  </Row>
                  <Row className="mmt-inputGroup-row mmt-row-timing-weight-priority" xl={3} lg={3} md={3} sm={3} >
                     <Col key={`col-form-timing`} className={`mmt-inputGroup-col`}>
                        <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-timing`}>
                           <FormDropdown
                              label={t('formLabel-timing')}
                              fluid
                              key={`dropdown-timing`}
                              items={['Daily', 'Weekly', 'Monthly']}
                              defaultValue={upperFirstLetter(goal.timing)}
                              onChange={
                                 (event, { value }) => handleMultiInputChange(event, [
                                    { field: `timing`, value: value ? (value as string).toLowerCase() : "mmt-NaN" }
                                 ])
                              }
                              disabled={viewingOnly}
                           />
                        </Flex>
                     </Col>
                     <Col key={`col-form-weight`} className={`mmt-inputGroup-col`}>
                        <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-weight`}>
                           <FormInput type="number" className="mmt-numberInput"
                              label={`${t('formLabel-weight')}`}
                              defaultValue={goal.weight.toString()}
                              onChange={
                                 (event, ctrl) => handleMultiInputChange(event, [
                                    { field: `weight`, value: ctrl?.value ? parseInt(ctrl?.value) : -1 }
                                 ])
                              }
                              disabled={viewingOnly}
                              min="1" max={"100"}
                              fluid
                           />
                        </Flex>
                     </Col>
                     <Col key={`col-form-priority`} className={`mmt-inputGroup-col`}>
                        <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-priority`}>
                           <FormInput type="number" className="mmt-numberInput"
                              label={`${t('formLabel-priority')}`}
                              defaultValue={goal.priority.toString()}
                              onChange={
                                 (event, ctrl) => handleMultiInputChange(event, [
                                    { field: `priority`, value: ctrl?.value ? parseInt(ctrl?.value) : -1 }
                                 ])
                              }
                              disabled={viewingOnly}
                              min="1" max={"5"}
                              fluid
                           />
                        </Flex>
                     </Col>
                  </Row>
                  <Row className="mmt-inputGroup-row mmt-row-achievementCriteria" xl={1} lg={1} md={1} sm={1} >
                     <Col key={`col-form-achievementCriteria`} className={`mmt-inputGroup-col`}>
                        <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-textArea-achievementCriteria`}>
                           <FormTextArea
                              label={t('formLabel-achievementCriteria')}
                              placeholder={t('formPlaceholder-achievementCriteria')}
                              name="goal-achievementCriteria"
                              fluid
                              className="mmt-textArea mmt-textArea-50"
                              defaultValue={goal.achievementCriteria}
                              onChange={(event, ctrl) =>
                                 handleMultiInputChange(event,
                                    [{ field: `achievementCriteria`, value: ctrl?.value }])
                              }
                              disabled={viewingOnly}
                           />
                        </Flex>
                     </Col>
                  </Row>
               </Form>
               <Segment className={"mmt-footer-container"}>
                  <Flex fill hAlign="end" gap="gap.small">
                     <Button
                        content={t('common:button.cancel')}
                        onClick={(event) => handleOnCancel(event)}
                     />
                     <Button
                        content={t('common:button.submit')}
                        primary
                        disabled={viewingOnly}
                        // disabled={!isValid}
                        onClick={(event) => handleOnSubmit(event)}
                     />
                  </Flex>
               </Segment>
            </>
            )}
      </>
   );
}

export default GoalForm;