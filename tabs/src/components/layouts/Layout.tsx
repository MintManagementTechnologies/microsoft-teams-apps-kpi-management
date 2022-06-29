import './Layout.scss';

import * as React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';

import { Flex } from '@fluentui/react-northstar';

import { useTeamsFx } from '../../common/lib/useTeamsFx';
import { getRouteParams } from '../../common/utils/sharedFunctions';
import TopBars from './topBars/TopBars';

const Layout = (): JSX.Element => {
   const { pathname } = useLocation();
   const {
       userScope,
       view,
       action,
       id
   } = getRouteParams(pathname);

   const { context } = useTeamsFx();
   const isTab = context && context?.frameContext === 'content';
   return (
      <>
         {isTab &&
            <TopBars loading={false} />
         }
         <Flex fill className={`mmt-layout mmt-${view} mmt-${view}-${action}`}>
            <Container fluid>
               <Outlet />
            </Container>
         </Flex>
      </>
   );
}

export default Layout;

// return (
//    <>
//       {isTab &&
//          <>
//             <TopBars loading={false} />
//             <Flex fill className={`mmt-layout mmt-${view} mmt-${view}-${action}`}>
//                <Container fluid>
//                   <Outlet />
//                </Container>
//             </Flex>
//          </>
//       }
//       {!isTab &&
//          <Outlet />
//       }
//    </>
// );