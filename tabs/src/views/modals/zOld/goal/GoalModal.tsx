import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, Loader } from '@fluentui/react-northstar';

import ErrorMessage from '../../../../components/common/ErrorMessage';
import ApproveGoalBatchWrapper from './ApproveGoalBatchWrapper';
import EditDetailsGoalWrapper from './EditDetailsGoalWrapper';
import NewGoalWrapper from './NewGoalWrapper';

const GoalModal = (props: { action: string, id: string }): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { action, id } = props;

   const renderActionModal = () => {
      switch (action) {
         case 'new':
            return <NewGoalWrapper />
         case 'details':
         case 'edit':
            return <EditDetailsGoalWrapper />
         case 'reject':
         case 'approve':
            return <ApproveGoalBatchWrapper outcome={action} />
         default:
            return <ErrorMessage message={t('error.modal.action')} messageDetails={`Could not find the ${action} in My Goals`} />;
      }
   }

   return (
      <>
         {renderActionModal()}
      </>
   );
}

export default GoalModal;