import './Modal.scss';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { Flex } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';

import { getRouteParams } from '../../../common/utils/sharedFunctions';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Loader from '../../../components/common/Loader';
import {
    useGetCurrentAppraisalPeriodQuery
} from '../../../features/appraisalPeriods/appraisalPeriodService';
import SubmitAppraisal from '../../../features/appraisals/parts/forms/SubmitAppraisal';
import SubmitGoalBatch from '../../../features/goalBatches/parts/forms/SubmitGoalBatch';
import GoalForm from '../../../features/goals/parts/forms/GoalForm';
import { selectCloseModalState } from '../../../features/shared/selectors';
import { RootState, useTypedSelector } from '../../../store';
import HrAdminModal from '../../modals/HrAdminModal';
import MeetingConfigModal from '../../modals/MeetingConfigModal';
import ReviewAppraisalModal from '../../modals/ReviewAppraisalModal';
import ReviewGoalBatchModal from '../../modals/ReviewGoalBatchModal';
import GoalModal from '../../modals/zOld/goal/GoalModal';
import { getDimensions } from './modalDimensions';

const TabConfig = (): JSX.Element => {
   const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html#`;
   const [contentUrl, setContentUrl] = useState(baseUrl + "/hr/mygoals/browse/1?layout=list");
   const [tabName, setTabName] = useState("HR Administration");
   const [modalContext, setModalContext] = useState('hr');
   const [isHRuser, setIsHRuser] = useState(false);

   const { t } = useTranslation();

   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);
   const selectedBatchFormState = useTypedSelector((state: RootState) => state.goalBatch.formState);
   const selectedBatchStage = useTypedSelector((state: RootState) => state.goalBatch.formResult) as string;
   const selectedBatch = useTypedSelector((state: RootState) => state.goalBatch.item);
   const { data: dataGetCurrentAppraisalPeriod, isFetching: isFetchingGetCurrentAppraisalPeriod, isLoading: isLoadingGetCurrentAppraisalPeriod }
      = useGetCurrentAppraisalPeriodQuery();

   useEffect(() => {
      microsoftTeams.settings.setValidityState(false);
   }, [])

   useEffect(() => {
      if (selectedBatchFormState !== 'isValid') {
         microsoftTeams.settings.setValidityState(false);
         return
      };
      setContentUrl(`${baseUrl}/me/${selectedBatchStage}/batch/${selectedBatch.id}/user/${selectedBatch.userId}`);
      setTabName(selectedBatchStage === 'myGoals' ? 'Goals' : 'Appraisal');
      microsoftTeams.settings.setValidityState(true);
   }, [selectedBatchFormState, selectedBatchStage])

   useEffect(() => {
      if (selectedCurrentEmployee.id === 0 || isHRuser) return;
      if (selectedCurrentEmployee.departmentId === 1 || selectedCurrentEmployee.department === 'Human Resources' || selectedCurrentEmployee.departmentId === 108 || selectedCurrentEmployee.department.toLowerCase().includes('human')) {
         setIsHRuser(true);
         microsoftTeams.settings.setValidityState(modalContext === 'hr');
      }
   }, [selectedCurrentEmployee, modalContext])

   // Initialize the Microsoft Teams SDK
   microsoftTeams.initialize();
   microsoftTeams.getContext((context: microsoftTeams.Context) => {
      const meetingId = context.meetingId;
      if (meetingId && meetingId.length > 0) {
         setModalContext(`meeting`);
      }
   });
   microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
      microsoftTeams.settings.setSettings({
         suggestedDisplayName: tabName,
         entityId: uuid(),
         contentUrl: contentUrl,
      });
      saveEvent.notifySuccess();
   });

   const isLoadingModal = selectedCurrentEmployee.id === 0;
   const isLoadingAppraisalPeriod = isFetchingGetCurrentAppraisalPeriod || isLoadingGetCurrentAppraisalPeriod || !dataGetCurrentAppraisalPeriod;
   return (
      <Flex
         className={`mmt-taskModule mmt-config-${modalContext}`}
         gap="gap.medium"
         padding="padding.medium"
         column
      >
         {isLoadingModal ? <Loader message={t('common:entity.setting', { count: 0 })} />
            : (modalContext === 'hr' ?
               <HrAdminModal view={'teamTab'} action={isHRuser ? 'allowed' : 'denied'} id={-1} />
               : <>
                  {isLoadingAppraisalPeriod && <Loader message={t('entity.appraisalPeriod', { count: 1 })} />}
                  {!isLoadingAppraisalPeriod &&
                     <MeetingConfigModal
                        userId={selectedCurrentEmployee.id}
                        isHRuser={isHRuser}
                        appraisalPeriodId={dataGetCurrentAppraisalPeriod.id}
                     />
                  }
               </>
            )
         }
      </Flex>
   );
}

export default TabConfig;