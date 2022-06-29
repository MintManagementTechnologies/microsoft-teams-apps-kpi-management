import * as React from 'react';
import { useParams } from 'react-router-dom';

import HRadminTab from '../hrAdminTab/HRadminTab';
import MyAppraisalsTab from '../myAppraisalsTab/MyAppraisalsTab';

const AppraisalsViewHOC = (props: { currentUserUPN: string }): JSX.Element => {
   const { currentUserUPN } = props;
   const { userScope } = useParams<{ userScope: string }>();

   return (
      <>{(userScope === 'hr' ?
         <HRadminTab currentUserUPN={currentUserUPN} view={'myappraisals'} />
         :
         <MyAppraisalsTab currentUserUPN={currentUserUPN} />
      )}</>
   );
}

export default AppraisalsViewHOC;