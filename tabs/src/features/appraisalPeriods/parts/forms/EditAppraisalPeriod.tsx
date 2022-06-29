import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import {
    AcceptIcon, Alert, Button, CloseIcon, Flex, FlexItem, Form, FormDropdown, FormRadioGroup, Input,
    PresenceAvailableIcon, SaveIcon, Segment, TrashCanIcon
} from '@fluentui/react-northstar';

import {
    getStatusOptions, monthOptions, reminderFrequencyOptions, yearOptions
} from '../../../../common/utils/formVariables';
import { useAppDispatch } from '../../../../store';
import { formResultChanged, formStateChanged, sliceChanged } from '../../appraisalPeriodSlice';
import { IAppraisalPeriodModel, newAppraisalPeriod } from '../../types';

const EditAppraisalPeriod = (props: {
   item: IAppraisalPeriodModel,
   displayMode?: string
}): JSX.Element => {
   const { item, displayMode } = props;

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [itemState, setItemState] = useState(item);
   const [isValid, setIsValid] = useState(false);

   useEffect(() => {
      if (!itemState) return;
      setIsValid(itemState.title.length > 2);
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
            <Row className="mmt-inputGroup-row mmt-row-months" xl={2} lg={2} md={2} sm={2} >
               <Col key={`col-form-startMonth`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-startMonth`}>
                     <FormDropdown
                        label={t('form.period.start')}
                        fluid
                        key={`dropdown-startMonth`}
                        items={monthOptions}
                        defaultValue={monthOptions[item.startMonthIndex]}
                        onChange={
                           (event, { value }) => handleMultiInputChange(event, [
                              { field: `startMonthIndex`, value: value ? (value as any).key : -1 }
                           ])
                        }
                        disabled={viewingOnly}
                     />
                  </Flex>
               </Col>
               <Col key={`col-form-endMonth`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-endMonth`}>
                     <FormDropdown
                        label={t('form.period.end')}
                        fluid
                        key={`dropdown-endMonth`}
                        items={monthOptions}
                        defaultValue={monthOptions[item.endMonthIndex]}
                        onChange={
                           (event, { value }) => handleMultiInputChange(event, [
                              { field: `endMonthIndex`, value: value ? (value as any).key : -1 }
                           ])
                        }
                        disabled={viewingOnly}
                     />
                  </Flex>
               </Col>
            </Row>
            {/* <Row className="mmt-inputGroup-row mmt-row-year-reminderFrequency" xl={2} lg={2} md={2} sm={2} > */}
            <Row className="mmt-inputGroup-row mmt-row-year-status" xl={2} lg={2} md={2} sm={2} >
               <Col key={`col-form-year`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-year`}>
                     <FormDropdown
                        label={t('form.period.year')}
                        fluid
                        key={`dropdown-year`}
                        items={yearOptions}
                        defaultValue={yearOptions.find(x => x.key === item.year)}
                        onChange={
                           (event, { value }) => handleMultiInputChange(event, [
                              { field: `year`, value: value ? (value as any).key : -1 }
                           ])
                        }
                        disabled={viewingOnly}
                     />
                  </Flex>
               </Col>
               <Col key={`col-form-status`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" fill className={`mmt-inputGroup mmt-radioGroup-status`}>
                     <FlexItem>
                        <FormRadioGroup
                           label={t('form.status.label')}
                           defaultCheckedValue={item.active ? 1 : 0}
                           items={getStatusOptions()}
                           onCheckedValueChange={(event, data) => handleMultiInputChange(event, [
                              { field: `active`, value: data?.value === 1 }
                           ])}
                        />
                     </FlexItem>
                  </Flex>
               </Col>
               {/* <Col key={`col-form-reminderFrequency`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" column fill className={`mmt-inputGroup mmt-dropdown-reminderFrequency`}>
                     <FormDropdown
                        label={t('form.period.reminderFrequency')}
                        fluid
                        key={`dropdown-reminderFrequency`}
                        items={reminderFrequencyOptions}
                        defaultValue={reminderFrequencyOptions.find(x => x.key === item.reminderFrequency)}
                        onChange={
                           (event, { value }) => handleMultiInputChange(event, [
                              { field: `reminderFrequency`, value: value ? (value as any).key : -1 }
                           ])
                        }
                        disabled={viewingOnly}
                     />
                  </Flex>
               </Col> */}
            </Row>
            {/* <Row className="mmt-inputGroup-row mmt-row-status" xl={1} lg={1} md={1} sm={1} >
               <Col key={`col-form-status`} className={`mmt-inputGroup-col`}>
                  <Flex gap="gap.small" fill className={`mmt-inputGroup mmt-radioGroup-status`}>
                     <FlexItem>
                        <FormRadioGroup
                           label={t('form.status.label')}
                           defaultCheckedValue={item.active ? 1 : 0}
                           items={getStatusOptions()}
                           onCheckedValueChange={(event, data) => handleMultiInputChange(event, [
                              { field: `active`, value: data?.value || '' }
                           ])}
                        />
                     </FlexItem>
                  </Flex>
               </Col>
            </Row> */}
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
                  disabled={viewingOnly}
                  onClick={(event) => handleOnSubmit(event)}
               />
            </Flex>
         </Segment>
      </>
   );
}

export default EditAppraisalPeriod;