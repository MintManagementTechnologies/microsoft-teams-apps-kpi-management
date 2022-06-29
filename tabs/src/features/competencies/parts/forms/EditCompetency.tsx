import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import {
    AcceptIcon, Alert, Button, CloseIcon, Flex, FlexItem, Form, FormDropdown, FormInput,
    FormRadioGroup, FormTextArea, Input, PresenceAvailableIcon, SaveIcon, Segment, TrashCanIcon
} from '@fluentui/react-northstar';

import {
    getStatusOptions, monthOptions, reminderFrequencyOptions, yearOptions
} from '../../../../common/utils/formVariables';
import { useAppDispatch } from '../../../../store';
import KeyResultAreaDropdown from '../../../keyResultAreas/parts/KeyResultAreaDropdown';
import WorkgradeDropdown from '../../../workgrades/parts/WorkgradeDropdown';
import { formResultChanged, formStateChanged, sliceChanged } from '../../competencySlice';
import { ICompetencyModel, newCompetency } from '../../types';

const EditCompetency = (props: {
   item: ICompetencyModel,
   displayMode?: string
}): JSX.Element => {
   const { item, displayMode } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [itemState, setItemState] = useState(item);
   const [isValid, setIsValid] = useState(false);
   
   useEffect(() => {
      if (!itemState) return;
      const tmpIsValid = [itemState.workgradeId, itemState.title, itemState.kraId, itemState.weight, itemState.description].every(Boolean)
      setIsValid(tmpIsValid);
   }, [itemState]);

   const handleOnSubmit = async (_event: any) => {
      if (_event !== null) _event.preventDefault();
      dispatch(formResultChanged('callback'));
      dispatch(sliceChanged({ item: itemState, triggerApi: true }));
   }

   const handleOnCancel = (_event: any) => {
      if (_event !== null) _event.preventDefault();
      dispatch(formStateChanged('closeForm'));
   }

   const handleMultiInputChange = (_event: any, keyValuePair: { field: string, value: any }[]) => {
      if (_event !== null) _event.preventDefault();

      let _item = { ...itemState };
      keyValuePair.forEach(x => {
         //@ts-ignore
         _item[x.field] = x.value;
      });
      setItemState(_item);
   }

   const viewingOnly = displayMode === 'view';
   const submitBtnContent = displayMode === 'edit' ? 'update' : 'submit';
   const viewModeClass = viewingOnly ? 'mmt-viewingOnly' : '';
   return (
      <>
         <Flex column fill gap="gap.small"
            className={`mmt-taskModule-body mmt-inputForm ${viewModeClass}`} >
            {/* <Row className="mmt-inputGroup-row mmt-row-keyResultArea" xl={2} lg={2} md={2} sm={2} >
               <Col key={`col-form-keyResultArea`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-keyResultArea`}>
                     <KeyResultAreaDropdown
                        defaultItemId={item.kraId}
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
               <Col key={`col-form-workgrade`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-workgrade`}>
                     <WorkgradeDropdown
                        defaultItemId={item.workgradeId}
                        onChange={
                           (event, { value }: { value?: any }) =>
                              handleMultiInputChange(event, [
                                 { field: `workgradeId`, value: value ? value.key : 0 },
                              ])
                        }
                        disabled={viewingOnly}
                     />
                  </Flex>
               </Col>
            </Row> */}
            <Row className="mmt-inputGroup-row mmt-row-keyResultArea" xl={1} lg={1} md={1} sm={1} >
               <Col key={`col-form-keyResultArea`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-keyResultArea`}>
                     <KeyResultAreaDropdown
                        defaultItemId={item.kraId}
                        onChange={
                           (event, { value }: { value?: any }) =>
                              handleMultiInputChange(event, [
                                 { field: `kraId`, value: value ? value.key : 0 },
                                 { field: `kraTitle`, value: value ? value.header : "" },
                              ])
                        }
                        disabled={viewingOnly}
                     />
                  </Flex>
               </Col>
            </Row>
            <Row className="mmt-inputGroup-row mmt-row-workgrade" xl={1} lg={1} md={1} sm={1} >
               <Col key={`col-form-workgrade`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-workgrade`}>
                     <WorkgradeDropdown
                        defaultItemId={item.workgradeId}
                        onChange={
                           (event, { value }: { value?: any }) =>
                              handleMultiInputChange(event, [
                                 { field: `workgradeId`, value: value ? value.key : 0 },
                              ])
                        }
                        disabled={viewingOnly}
                     />
                  </Flex>
               </Col>
            </Row>
            <Row className="mmt-inputGroup-row mmt-row-title" xl={1} lg={1} md={1} sm={1} >
               <Col key={`col-form-title`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-input-title`}>
                     <FormInput className="mmt-textInput"
                        label={t('form.competency.label')}
                        placeholder={t('form.competency.placeholder')}
                        defaultValue={item.title}
                        onChange={
                           (event, ctrl) => handleMultiInputChange(event, [
                              { field: `title`, value: ctrl?.value ? ctrl?.value : `` }
                           ])
                        }
                        disabled={viewingOnly}
                        fluid
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
            <Row className="mmt-inputGroup-row mmt-row-weight" xl={2} lg={2} md={2} sm={2} >
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
            </Row>
            <Row className="" xl={1} lg={1} md={1} sm={1} >
               <Col></Col>
            </Row>
         </Flex>
         <Segment className={"mmt-footer-container"}>
            <Flex fill hAlign="end" gap="gap.small">
               <Button
                  content={t('common:button.cancel')}
                  onClick={(event) => handleOnCancel(event)}
               />
               <Button
                  content={t(`common:button.${submitBtnContent}`)}
                  primary
                  disabled={!isValid || viewingOnly}
                  onClick={(event) => handleOnSubmit(event)}
               />
            </Flex>
         </Segment>
      </>
   );
}

export default EditCompetency;