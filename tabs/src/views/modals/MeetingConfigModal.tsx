import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown, Flex, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import GraphPeoplePicker from '../../components/common/graphPeoplePicker/GraphPeoplePicker';
import Loader from '../../components/common/Loader';
import AppraisalPeriodForm from '../../features/appraisalPeriods/parts/forms/AppraisalPeriodForm';
import CompetencyForm from '../../features/competencies/parts/forms/CompetencyForm';
import { useLazyGetEmployeeByUPNQuery } from '../../features/employees/employeeService';
import { IUserModel } from '../../features/employees/types';
import {
    useLazyGetGoalBatchesByAppraisalPeriodAndEmployeeQuery
} from '../../features/goalBatches/goalBatchService';
import {
    formResultChanged, formStateChanged, itemChanged
} from '../../features/goalBatches/goalBatchSlice';
import { useAppDispatch } from '../../store';

const MeetingConfigModal = (props: { userId: number, isHRuser: boolean, appraisalPeriodId: number }): JSX.Element => {
   const { userId, isHRuser, appraisalPeriodId } = props;
   const [showBatchDropdown, setShowBatchDropdown] = useState(false);

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const [triggerGetEmployeeByUPN,
      { data: dataGetEmployeeByUPN, isFetching: isFetchingGetEmployeeByUPN, isLoading: isLoadingGetEmployeeByUPN }]
      = useLazyGetEmployeeByUPNQuery();
   const [triggerGetGoalBatches,
      { data: dataGetGoalBatches,
         isFetching: isFetchingGetGoalBatches,
         isLoading: isLoadingGetGoalBatches }]
      = useLazyGetGoalBatchesByAppraisalPeriodAndEmployeeQuery();

   useEffect(() => {
      dispatch(formResultChanged('myGoals'));
   }, [])

   useEffect(() => {
      if (dataGetEmployeeByUPN && (dataGetEmployeeByUPN.managers.map(x => x.id).includes(userId) || isHRuser)) {
         setShowBatchDropdown(true);
         triggerGetGoalBatches({ userId: dataGetEmployeeByUPN.id, appraisalPeriodId: appraisalPeriodId });
      } else {
         setShowBatchDropdown(false);
      }
   }, [dataGetEmployeeByUPN])

   useEffect(() => {
      if (!dataGetGoalBatches) {
         dispatch(formStateChanged(``));
      };
   }, [dataGetGoalBatches])


   const handleOnStageChange = (event: any, value: any) => {
      if (event !== null) event.preventDefault();
      dispatch(formResultChanged(value.key));
   }

   const handleOnPeoplePickerChange = (user: any) => {
      if (!(user && user.upn)) return;
      triggerGetEmployeeByUPN(user.upn)
   }

   const handleOnBatchChange = (event: any, value: any) => {
      if (event !== null) event.preventDefault();
      if (!dataGetGoalBatches) return;
      dispatch(itemChanged(dataGetGoalBatches.find(x => x.id === value.key)));
      dispatch(formStateChanged(`isValid`));
   }

   const stageOptions = [
      { header: `Goals Review`, key: `myGoals` },
      { header: `Appraisal Review`, key: `myAppraisals` },
   ];
   const isLoadingEmployee = isLoadingGetEmployeeByUPN || isFetchingGetEmployeeByUPN;
   const isLoadingBatches = isLoadingGetGoalBatches || isFetchingGetGoalBatches;


   const handleOnChange = (event: any, value: string) => {
      triggerGetEmployeeByUPN(value)
   }

   const dropdownOptions = [
      {
         key: 'HR.Staff@africaprudential.com',
         header: 'Test Employee',
         content: 'This user is used to create goals and submit for review, etc.'
      },
      {
         key: 'HR.Line1@africaprudential.com',
         header: 'Test Line Manager 1',
         content: '1st manager of the test employee. Only one responsible to provide appraisal goal results.'
      },
      {
         key: 'HR.Line2@africaprudential.com',
         header: 'Test Line Manager 2',
         content: '2nd manager of the test employee. Only responsible to approve / reject initial goal setting and appraisal.'
      },
      {
         key: 'HR.Test@africaprudential.com',
         header: 'Test HR Employee',
         content: 'This user is used to manage the general app config and final approver.'
      }
   ];
   return (
      <>
         <Flex gap={`gap.medium`} vAlign='center' fill column>
            <Flex fill column gap="gap.small">
               <Text content={`Select Stage`} size="small" weight="bold" />
               <Dropdown
                  fluid
                  className="mmt-meeting-stage"
                  defaultValue={stageOptions[0]}
                  items={stageOptions}
                  onChange={(event, { value }) => handleOnStageChange(event, value)}
               />
            </Flex>
            <br />
            <Flex fill column gap="gap.small">
               <Text content={`Select User`} size="small" weight="bold" />
               <Dropdown
                  fluid
                  inverted
                  items={dropdownOptions}
                  defaultValue={dropdownOptions[0]}
                  onChange={(event, { value }: { value?: any }) =>
                     handleOnChange(event, value ? value.key : "")
                  }
                  styles={{
                     minWidth: '300px'
                  }}
               />
               {/* <GraphPeoplePicker fieldId={'upn'} onChange={handleOnPeoplePickerChange} /> */}
            </Flex>
            <br />
            {isLoadingEmployee && <Loader message={t('entity.employee', { count: 1 })} />}
            {(!isLoadingEmployee && showBatchDropdown) &&
               <>
                  {isLoadingBatches && <Loader message={t('entity.appraisal', { count: 0 })} />}
                  {!isLoadingBatches &&
                     <Flex fill column gap="gap.small">
                        <Text content={`Select Appraisal`} size="small" weight="bold" />
                        <Dropdown
                           fluid
                           className="mmt-meeting-batch"
                           placeholder={t(`common:general.placeholder`)}
                           items={dataGetGoalBatches?.map(x => ({
                              header: x.title,
                              content: x.status,
                              key: x.id,
                           }))}
                           onChange={(event, { value }) => handleOnBatchChange(event, value)}
                        />
                     </Flex>
                  }
               </>
            }
         </Flex>
      </>
   );
}

export default MeetingConfigModal;