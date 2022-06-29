import './TopBars.scss';

import { Col, Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { Flex, Segment, Text } from '@fluentui/react-northstar';

import { getRouteParams } from '../../../common/utils/sharedFunctions';
import Filters from '../../../features/filters/parts/popupFilters/Filters';
import SearchBox from '../../../features/filters/parts/searchBox/SearchBox';
import CommandButton from '../../commands/CommandButton';
import { getSingleCommand } from '../../commands/commands';
import GoalViews from '../../common/userscopeViewToggle/UserscopeViewToggle';
import HRgoalsHeader from './appraisalPeriodBar/HRgoalsHeader';
import TeamGoalsHeader from './appraisalPeriodBar/TeamGoalsHeader';
import UserGoalsHeader from './appraisalPeriodBar/UserGoalsHeader';
import TopActionsBar from './TopActionsBar';

const TopBars = (props: { loading: boolean }): JSX.Element => {
   const { pathname } = useLocation();
   const { loading } = props;
   const {
      userScope,
      view,
      action,
      id
   } = getRouteParams(pathname);
   const isMyGoalsView = (view === 'mygoals');
   const isBrowseAction = (action.includes('browse') || action.includes('batch'));

   return (
      <Flex className='mmt-topBar'>
         <Container fluid>
            <TopActionsBar loading={loading} />
            {userScope === 'team' && isBrowseAction &&
               <TeamGoalsHeader loading={loading} />
            }
            {userScope === 'me' && isBrowseAction &&
               <UserGoalsHeader loading={loading} />
            }
            {userScope === 'hr' && isBrowseAction &&
               <HRgoalsHeader loading={loading} />
            }
         </Container>
      </Flex>
   );
}

export default TopBars;