import * as React from 'react';
import { useParams } from 'react-router-dom';

import HRadminTab from '../hrAdminTab/HRadminTab';
import MyGoalsTab from '../myGoalsTab/MyGoalsTab';
import AppraisalReviewWrapper from './overviewPage/AppraisalReviewWrapper';
import GoalBatchReviewWrapper from './overviewPage/GoalBatchReviewWrapper';

const OverviewHOC = (props: { currentUserUPN: string }): JSX.Element => {
   const { currentUserUPN } = props;
   const { view } = useParams<{ view: string }>();

   return (
      <>{(view === 'mygoals' ?
         <GoalBatchReviewWrapper currentUserUPN={currentUserUPN} />
         :
         <AppraisalReviewWrapper currentUserUPN={currentUserUPN} />
      )}</>
   );
}

export default OverviewHOC;