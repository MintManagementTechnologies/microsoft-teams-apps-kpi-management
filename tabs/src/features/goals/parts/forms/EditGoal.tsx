import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
    Button, Flex, Form, FormDropdown, FormInput, FormTextArea, Segment
} from '@fluentui/react-northstar';

import { useAppDispatch } from '../../../../store';
import KeyResultAreaDropdown from '../../../keyResultAreas/parts/KeyResultAreaDropdown';
import { formResultChanged, formStateChanged, sliceChanged } from '../../goalSlice';
import { IGoalModel, newGoal } from '../../types';

const EditGoal = (props: {
   item: IGoalModel,
   displayMode?: string
}): JSX.Element => {
   const { item, displayMode } = props;
   const [searchParams, setSearchParams] = useSearchParams();
   const weightRemaining = searchParams.get("weightRemaining") !== null ? parseInt(searchParams.get("weightRemaining") as string) : 100;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [itemState, setItemState] = useState(item);
   const [isValid, setIsValid] = useState(false);

   useEffect(() => {
      if (!itemState) return;
      const tmpIsValid = [itemState.batchId, itemState.userId, itemState.kraId, itemState.timing, itemState.weight, itemState.priority, itemState.measureOfSuccess, itemState.description, itemState.achievementCriteria].every(Boolean)
      const weightIsValid = itemState.weight <= weightRemaining;
      setIsValid(tmpIsValid && weightIsValid);
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
                        placeholder={t('form.timing.placeholder')}
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
                        min="1" max={weightRemaining}
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
                  disabled={viewingOnly || !isValid}
                  onClick={(event) => handleOnSubmit(event)}
               />
            </Flex>
         </Segment>
      </>
   );
}

export default EditGoal;