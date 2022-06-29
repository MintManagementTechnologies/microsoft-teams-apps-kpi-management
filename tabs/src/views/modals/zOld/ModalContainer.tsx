import './Modal.scss';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, Loader } from '@fluentui/react-northstar';

import ErrorMessage from '../../../components/common/ErrorMessage';
import HrAdminModal from '../HrAdminModal';
import GoalModal from './goal/GoalModal';

const ModalContainer = (): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { userScope, view, action, id } = useParams();

   // const renderMyAppraisalsModals = () => {
   //    switch (action) {
   //       case 'new':
   //          return <NewGoalWrapper />
   //       case 'details':
   //       case 'edit':
   //          return <EditDetailsGoalWrapper />
   //       case 'approve':
   //       default:
   //          return <ErrorMessage message={t('error.modal.action')} messageDetails={`Could not find the ${action} in My Appraisals`} />;
   //    }
   // }

   const renderView = () => {
      switch (view) {
         case 'mygoals':
            return <GoalModal action={action!} id={id!} />;
         case 'kra':
         case 'competency':
         case 'period':
         case 'user':
            // return <HrAdminModal view={view} action={action!} />;
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
         {renderView()}
      </Flex>
   );
}

export default ModalContainer;