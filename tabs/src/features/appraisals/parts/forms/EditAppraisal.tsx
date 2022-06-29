import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
    Button, Flex, Form, FormDropdown, FormInput, FormTextArea, Segment
} from '@fluentui/react-northstar';
import { useAppDispatch } from '../../../../store';
import KeyResultAreaDropdown from '../../../keyResultAreas/parts/KeyResultAreaDropdown';
import { sliceChanged } from '../../appraisalSlice';
import { IAppraisalModel, newAppraisal } from '../../types';

const EditAppraisal = (props: {
   item: IAppraisalModel,
}): JSX.Element => {
   const { item } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [itemState, setItemState] = useState(item);
   const [isValid, setIsValid] = useState(false);
   const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);

   useEffect(() => {
      if (!itemState) return;
      setIsValid(itemState.description.length > 2);
   }, [itemState]);


   const handleOnSave = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      if (itemState.description !== item.description)
         dispatch(sliceChanged({ item: itemState, triggerApi: true }));
      else {
         dispatch(sliceChanged({ item: newAppraisal, triggerApi: false }));
      }
   }

   const handleOnDelete = (_event: any) => {
      if (_event !== null) _event.preventDefault();
      setShowConfirmationMsg(!showConfirmationMsg);
   }

   const handleOnSubmit = async (event: any) => {
      event.preventDefault();
      // onSubmit(selectedValuesState);
      // microsoftTeams.tasks.submitTask("refresh");
   }

   const handleOnCancel = (event: any) => {
      event.preventDefault();
      microsoftTeams.tasks.submitTask("cancel");
   }

   const handleMultiInputChange = (_event: any, keyValuePair: { field: string, value: any }[]) => {
      if (_event !== null) _event.preventDefault();

      let _item = { ...item };
      keyValuePair.forEach(x => {
         //@ts-ignore
         _item[x.field] = x.value;
      });
      setItemState(_item);
   }

   const viewingOnly = false; //TODO crudOperation === 'details';
   const submitBtnContent = 'submit';
   const viewModeClass = '' //TODO viewingOnly ? 'mmt-viewingOnly' : '';
   return (
      <>
         <Form
            onSubmit={(event) => handleOnSubmit(event)}
            className={`mmt-taskModule-body mmt-inputForm ${viewModeClass}`}
         >
            <Row className="mmt-inputGroup-row mmt-row-keyResultArea" xl={1} lg={1} md={1} sm={1} >
               <Col key={`col-form-keyResultArea`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-keyResultArea`}>
                     <KeyResultAreaDropdown
                        defaultItemId={item.kraId}
                        onChange={
                           (event, { value }: { value?: any }) =>
                              handleMultiInputChange(event, [
                                 { field: `kraId`, value: value ? value.key : 0 },
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
                        label={t('form.description.label')}
                        placeholder={t('form.description.placeholder')}
                        fluid
                        className="mmt-textArea mmt-textArea-50"
                        defaultValue={item.description}
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
                        label={t('form.measureOfSuccess.label')}
                        placeholder={t('form.measureOfSuccess.placeholder')}
                        fluid
                        className="mmt-textArea mmt-textArea-50"
                        defaultValue={item.measureOfSuccess}
                        onChange={(event, ctrl) =>
                           handleMultiInputChange(event,
                              [{ field: `measureOfSuccess`, value: ctrl?.value }])
                        }
                        disabled={viewingOnly}
                     />
                  </Flex>
               </Col>
            </Row>
            <Row className="mmt-inputGroup-row mmt-row-timing mmt-row-weight mmt-row-priority" xl={3} lg={3} md={3} sm={3} >
               <Col key={`col-form-timing`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-timing`}>
                     <FormDropdown
                        label={t('form.timing.label')}
                        fluid
                        items={['Daily', 'Weekly', 'Monthly']}
                        defaultValue={item.timing.upperFirstLetter()}
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
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-input-weight`}>
                     <FormInput type="number" className="mmt-numberInput"
                        label={t('form.weight.label')}
                        defaultValue={item.weight.toString()}
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
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-input-priority`}>
                     <FormInput type="number" className="mmt-numberInput"
                        label={t('form.priority.label')}
                        defaultValue={item.priority.toString()}
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
                        label={t('form.achievementCriteria.label')}
                        placeholder={t('form.achievementCriteria.placeholder')}
                        fluid
                        className="mmt-textArea mmt-textArea-100"
                        defaultValue={item.achievementCriteria}
                        onChange={(event, ctrl) =>
                           handleMultiInputChange(event,
                              [{ field: `achievementCriteria`, value: ctrl?.value }])
                        }
                        disabled={viewingOnly}
                     />
                  </Flex>
               </Col>
            </Row>
            <Row className="" xl={1} lg={1} md={1} sm={1} >
               <Col></Col>
            </Row>
         </Form>
         <Segment className={"mmt-footer-container"}>
            <Flex fill hAlign="end" gap="gap.small">
               <Button
                  content={t('common:button.cancel')}
                  onClick={(event) => handleOnCancel(event)}
               />
               <Button
                  content={t(`common:button.${submitBtnContent}`)}
                  primary
                  disabled={viewingOnly}
                  // disabled={!isValid}
                  onClick={(event) => handleOnSubmit(event)}
               />
            </Flex>
         </Segment>
      </>
   );
}

export default EditAppraisal;