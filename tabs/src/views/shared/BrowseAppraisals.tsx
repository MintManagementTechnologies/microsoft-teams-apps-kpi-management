import { useParams } from 'react-router-dom';

import HRadminTab from '../hrAdminTab/HRadminTab';
import MyAppraisalsTab from '../myAppraisalsTab/MyAppraisalsTab';

const BrowseAppraisals = (props: { currentUserUPN: string, view: string }): JSX.Element => {
   const { currentUserUPN, view } = props;
   const { userScope } = useParams<{ userScope: string }>();

   return (
      <>{(userScope === 'hr' ?
         <HRadminTab currentUserUPN={currentUserUPN} view={view} />
         :
         <MyAppraisalsTab currentUserUPN={currentUserUPN} />
      )}</>
   );
}

export default BrowseAppraisals;