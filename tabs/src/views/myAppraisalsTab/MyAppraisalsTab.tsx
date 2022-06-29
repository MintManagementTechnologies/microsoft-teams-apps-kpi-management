import './MyAppraisalsTab.scss';

import { useParams } from 'react-router-dom';

import BrowseMyAppraisals from './BrowseMyAppraisals';
import BrowseTeamAppraisals from './BrowseTeamAppraisals';

const MyAppraisalsTab = (props: { currentUserUPN: string }): JSX.Element => {
   const { userScope } = useParams<{ userScope: string }>();

   return (
      <>
         {(userScope === 'me' ?
            <BrowseMyAppraisals />
            :
            <BrowseTeamAppraisals />
         )}
      </>
   );
}

export default MyAppraisalsTab;