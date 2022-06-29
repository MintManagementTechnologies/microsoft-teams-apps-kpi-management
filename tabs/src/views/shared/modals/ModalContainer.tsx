import './Modal.scss';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Flex } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';

import { getRouteParams } from '../../../common/utils/sharedFunctions';
import ErrorMessage from '../../../components/common/ErrorMessage';
import SubmitAppraisal from '../../../features/appraisals/parts/forms/SubmitAppraisal';
import SubmitGoalBatch from '../../../features/goalBatches/parts/forms/SubmitGoalBatch';
import GoalForm from '../../../features/goals/parts/forms/GoalForm';
import { selectCloseModalState } from '../../../features/shared/selectors';
import { RootState, useTypedSelector } from '../../../store';
import HrAdminModal from '../../modals/HrAdminModal';
import ReviewAppraisalModal from '../../modals/ReviewAppraisalModal';
import ReviewGoalBatchModal from '../../modals/ReviewGoalBatchModal';
import GoalModal from '../../modals/zOld/goal/GoalModal';
import { getDimensions } from './modalDimensions';

const ModalContainer = (): JSX.Element => {
   const { t } = useTranslation();
   const { userScope, view, id } = getRouteParams(window.location.hash);
   const { action } = useParams<{ action: string }>();

   let newSize = getDimensions(view, action);
   microsoftTeams.tasks.updateTask(newSize);
   // dialog.update.resize(newSize);
   const itemId = id || 'notFound';

   const selectedCloseModalState = useSelector(selectCloseModalState);
   const selectedCurrentEmployee = useTypedSelector((state: RootState) => state.employee.currentEmployee);

   useEffect(() => {
      if (!selectedCloseModalState) return;
      // dialog.submit({ 
      //    action: selectedCloseModalState.action, 
      //    additionalInfo: selectedCloseModalState.additionalInfo 
      // });
      microsoftTeams.tasks.submitTask({ 
         action: selectedCloseModalState.action, 
         additionalInfo: selectedCloseModalState.additionalInfo
      });
   }, [selectedCloseModalState]);

   const renderGoalBatchAction = (_action: string = '', _itemdId: number = -1) => {
      switch (_action) {
         case 'approve':
            return <ReviewGoalBatchModal id={_itemdId} userId={selectedCurrentEmployee.id} />;
         case 'submit':
            return <SubmitGoalBatch id={_itemdId} userId={selectedCurrentEmployee.id} />;
         default:
            return <ErrorMessage message={t('error.modal.action')} messageDetails={`Could not find the ${action} in for the ModalContainer.renderGoalBatchAction`} />;
      }
   }

   const renderAppraisalAction = (_action: string = '', _itemdId: number = -1) => {
      switch (_action) {
         case 'approve':
            return <ReviewAppraisalModal id={_itemdId} userId={selectedCurrentEmployee.id} />;
         case 'submit':
            return <SubmitAppraisal id={_itemdId} userId={selectedCurrentEmployee.id} />;
         default:
            return <ErrorMessage message={t('error.modal.action')} messageDetails={`Could not find the ${action} in for the ModalContainer.renderAppraisalAction`} />;
      }
   }

   const renderView = () => {
      const existingId = action !== 'new' ? parseInt(itemId.toString()) : undefined;
      switch (view.toLowerCase()) {
         case 'mygoals':
            return <GoalModal action={action!} id={id!} />;
         // case 'myappraisals':
         //    return <GoalModal action={action!} id={id!} />;
         case 'goal':
            return <GoalForm displayMode={action} id={existingId} />;
         case 'appraisal':
            return renderAppraisalAction(action, existingId);
         case 'goalbatch':
            return renderGoalBatchAction(action, existingId);
         case 'competency':
         case 'period':
            return <HrAdminModal view={view} action={action!} id={itemId} />;
         default:
            return <ErrorMessage message={t('error.modal.view')} messageDetails={`Could not find the ${view} in for the ModalContainer`} />;
      }
   }

   return (
      <Flex
         className={`mmt-taskModule mmt-${view}-${action}`}
         gap="gap.medium"
         padding="padding.medium"
         column
      >
         {itemId === 'notFound' ?
            <ErrorMessage message={t('error.modal.action')} messageDetails={`No Item ID found in the ModalContainer for ${view}.`} />
            : renderView()
         }
      </Flex>
   );
}

export default ModalContainer;