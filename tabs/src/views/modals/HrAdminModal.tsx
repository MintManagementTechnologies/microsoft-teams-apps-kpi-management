import { useTranslation } from 'react-i18next';

import { Flex, Header } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import AppraisalPeriodForm from '../../features/appraisalPeriods/parts/forms/AppraisalPeriodForm';
import CompetencyForm from '../../features/competencies/parts/forms/CompetencyForm';

const HrAdminModal = (props: { view: string, action: string, id: string | number }): JSX.Element => {
   const { view, action, id } = props;
   const { t, i18n } = useTranslation();

   const renderView = () => {
      const existingId = action !== 'new' ? parseInt(id.toString()) : undefined;
      switch (view) {
         case 'competency':
            return <CompetencyForm displayMode={action} id={existingId} />;
         case 'period':
            return <AppraisalPeriodForm displayMode={action} id={existingId} />;
         case 'teamTab':
            if(action === 'denied'){
               return <ErrorMessage message={t('error.permission.access')} messageDetails={`You do not have permission to add this tab.`} />;
            } else {
               return (<Flex hAlign={'center'} vAlign="center" fill>
                  <Header as="h3" content={t('common:msg.hrTabConfig')} />
               </Flex>)
            }
         default:
            return <ErrorMessage message={t('error.modal.view')} messageDetails={`Could not find the ${view} in for the HrAdminModal`} />;
      }
   }

   return (
      <>
         {renderView()}
      </>
   );
}

export default HrAdminModal;