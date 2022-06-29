import './App.scss';

import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { Button, Loader, mergeThemes, Provider, teamsTheme, Text } from '@fluentui/react-northstar';
import { Client } from '@microsoft/microsoft-graph-client';

import { useTeamsFx } from './common/lib/useTeamsFx';
import colorScheme from './common/utils/colorScheme';
import { log } from './common/utils/customConsoleLog';
import { setLocale } from './common/utils/i18n';
import UserSwitchDropdown from './components/common/userSwitch/UserSwitchDropdown';
import Layout from './components/layouts/Layout';
import { TeamsFxContext } from './Context';
import CurrentEmployee from './features/employees/CurrentEmployee';
import { userDetailsChanged } from './features/user/userSlice';
import { RootState, useAppDispatch, useTypedSelector } from './store';
import HRadminTab from './views/hrAdminTab/HRadminTab';
import AppraisalReviewContainer from './views/myAppraisalsTab/AppraisalReviewContainer';
import GoalBatchReviewContainer from './views/myGoalsTab/GoalBatchReviewContainer';
import BrowseAppraisals from './views/shared/BrowseAppraisals';
import BrowseGoals from './views/shared/BrowseGoals';
import ModalContainer from './views/shared/modals/ModalContainer';
import TabConfig from './views/shared/modals/TabConfig';
import AppraisalsViewHOC from './views/zOld/AppraisalsViewHOC';
import GoalsViewHOC from './views/zOld/GoalsViewHOC';
import OverviewHOC from './views/zOld/OverviewHOC';

export default function App() {
   const { theme, themeString, inTeams, loading, userCtx, graphClient, reload, context } = useTeamsFx();
   const currentUserUPN = useTypedSelector((state: RootState) => state.currentUser.upn);

   const customTheme = {
      componentVariables: {
         Button: {
            tintedBorderColor: "#e1e1e1",
            tintedBorderColorHover: "transparent",
         },
         RadioGroupItem: {
            indicatorBackgroundColorChecked: colorScheme.brand.foregroundActive1,
            indicatorBorderColorChecked: colorScheme.brand.foregroundActive1,
         },
      },
      siteVariables: {
         colorScheme: colorScheme
      }
   }
   const mergedTheme = mergeThemes(theme, customTheme);
   const api_regex = /^\/api\/.*/;
   if (api_regex.test(window.location.pathname)) {
      return <div /> // must return at least an empty div
   }
   const showUserSwitcher =
      currentUserUPN.toLowerCase() === 'HR.Staff@africaprudential.com'.toLowerCase() || 
      currentUserUPN.toLowerCase() === 'HR.Line1@africaprudential.com'.toLowerCase() || 
      currentUserUPN.toLowerCase() === 'HR.Line2@africaprudential.com'.toLowerCase() || 
      currentUserUPN.toLowerCase() === 'HR.Test@africaprudential.com'.toLowerCase();
   return (
      <TeamsFxContext.Provider value={{ theme, themeString, context }}>
         <Provider theme={mergedTheme || teamsTheme} >
            <div className={`mmt-appContainer mmt-${themeString}`} >
               <CurrentEmployee as='hidden' upn={currentUserUPN} />
               {showUserSwitcher &&
                  <UserSwitchDropdown />
               }
               {/* <CurrentEmployee as='hidden' id={1424} /> */}
               <HashRouter>
                  {loading ? (
                     <Loader style={{ margin: 100 }} />
                  ) : (
                     inTeams ? (
                        <Routes>
                           <Route path="/" element={<Layout />}>
                              <Route path=":userScope" >
                                 <Route path={"mygoals"} >
                                    <Route path="browse/:pageIndex/" element={<BrowseGoals currentUserUPN={userCtx.upn} view={'mygoals'} />} />
                                    <Route path="batch/:batchId/user/:userId/" element={<GoalBatchReviewContainer />} />
                                 </Route>
                                 <Route path="myappraisals" >
                                    <Route path="browse/:pageIndex/" element={<BrowseAppraisals currentUserUPN={userCtx.upn} view={'myappraisals'} />} />
                                    <Route path="batch/:batchId/user/:userId/" element={<AppraisalReviewContainer />} />
                                 </Route>
                                 <Route path={"oldgoals"} >
                                    <Route path="browse/:pageIndex/" element={<BrowseGoals currentUserUPN={userCtx.upn} view={'oldgoals'} />} />
                                    <Route path="batch/:batchId/user/:userId/" element={<GoalBatchReviewContainer />} />
                                 </Route>
                                 <Route path="oldappraisals" >
                                    <Route path="browse/:pageIndex/" element={<BrowseAppraisals currentUserUPN={userCtx.upn} view={'oldappraisals'} />} />
                                    <Route path="batch/:batchId/user/:userId/" element={<AppraisalReviewContainer />} />
                                 </Route>
                                 <Route path="settings" >
                                    <Route path=":section/:pageIndex/" element={<HRadminTab currentUserUPN={userCtx.upn} view={'settings'} />} />
                                 </Route>
                                 <Route path={":view"} >
                                    <Route path=":action/" element={<ModalContainer />} />
                                    <Route path=":action/:id/" element={<ModalContainer />} />
                                    <Route path={"overview"} >
                                       <Route path=":userUPN/" element={<OverviewHOC currentUserUPN={userCtx.upn} />} />
                                    </Route>
                                 </Route>
                              </Route>
                              <Route path="tabconfig" element={<TabConfig />} />
                           </Route>
                        </Routes>
                     ) :
                        <>
                           {/* <Button primary content="Authorize" disabled={loading} onClick={reload} /> */}
                           <Text content={`The app is only accessible from within Teams`} size="larger" weight="bold" />
                        </>
                  )}
               </HashRouter>
            </div>
         </Provider>
      </TeamsFxContext.Provider>
   );
}
