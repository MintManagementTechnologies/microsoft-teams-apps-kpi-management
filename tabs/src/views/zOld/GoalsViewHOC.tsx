import * as React from 'react';
import { useParams } from 'react-router-dom';

import { getRouteParams } from '../../common/utils/sharedFunctions';
import HRadminTab from '../hrAdminTab/HRadminTab';
import MyGoalsTab from '../myGoalsTab/MyGoalsTab';

const GoalsViewHOC = (props: { currentUserUPN: string }): JSX.Element => {
   const { currentUserUPN } = props;
   const { userScope } = useParams<{ userScope: string }>();
   const { view } = getRouteParams(window.location.hash);

   return (
      <></>
      // <>{(userScope === 'hr' ?
      //    <HRadminTab currentUserUPN={currentUserUPN} view={view} />
      //    :
      //    <MyGoalsTab currentUserUPN={currentUserUPN} />
      // )}</>
   );
}

export default GoalsViewHOC;