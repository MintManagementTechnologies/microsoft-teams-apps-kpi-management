import './HRadminTab.scss';

import * as React from 'react';

import ErrorMessage from '../../components/common/ErrorMessage';
import AllAppraisalsWrapper from './AllAppraisalsWrapper';
import AllGoalsWrapper from './AllGoalsWrapper';
import AllSettingsWrapper from './AllSettingsWrapper';
import BrowseAllAppraisals from './BrowseAllAppraisals';
import BrowseAllGoals from './BrowseAllGoals';

const HRadminTab = (props: { currentUserUPN: string, view: string }): JSX.Element => {
   const { currentUserUPN, view } = props;

   switch (view) {
      case 'mygoals':
         return <BrowseAllGoals />
      case 'myappraisals':
         return <BrowseAllAppraisals />
      case 'oldgoals':
         return <AllGoalsWrapper currentUserUPN={currentUserUPN} />
      case 'oldappraisals':
         return <AllAppraisalsWrapper currentUserUPN={currentUserUPN} />
      case 'settings':
         return <AllSettingsWrapper isLoading={false} />
      default:
         break;
   }
    

   return (
      <ErrorMessage message={'HRAdmin View Error'} messageDetails={`Could not find the ${view} in HRadminTab`} />
   );
}

export default HRadminTab;