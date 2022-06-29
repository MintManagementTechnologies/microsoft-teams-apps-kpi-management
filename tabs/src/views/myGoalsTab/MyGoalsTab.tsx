import './MyGoalsTab.scss';

import { useParams } from 'react-router-dom';

import BrowseMyGoals from './BrowseMyGoals';
import BrowseTeamGoals from './BrowseTeamGoals';

const MyGoalsTab = (props: { currentUserUPN: string }): JSX.Element => {
   const { currentUserUPN } = props;
   const { userScope } = useParams<{ userScope: string }>();

   return (
      <>
         {(userScope === 'me' ?
            <BrowseMyGoals />
            :
            <BrowseTeamGoals />
         )}
      </>
   );
}

export default MyGoalsTab;