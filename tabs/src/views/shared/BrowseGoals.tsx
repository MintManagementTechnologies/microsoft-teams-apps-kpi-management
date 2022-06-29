import { useParams } from 'react-router-dom';

import HRadminTab from '../hrAdminTab/HRadminTab';
import MyGoalsTab from '../myGoalsTab/MyGoalsTab';

const BrowseGoals = (props: { currentUserUPN: string, view: string }): JSX.Element => {
   const { currentUserUPN, view } = props;
   const { userScope } = useParams<{ userScope: string }>();

   return (
      <>{(userScope === 'hr' ?
         <HRadminTab currentUserUPN={currentUserUPN} view={view} />
         :
         <MyGoalsTab currentUserUPN={currentUserUPN} />
      )}</>
   );
}

export default BrowseGoals;