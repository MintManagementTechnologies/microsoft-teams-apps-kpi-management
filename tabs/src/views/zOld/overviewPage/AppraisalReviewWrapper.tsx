import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

import { Button, Flex, Loader, Segment, Text } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';
import { createSelector } from '@reduxjs/toolkit';

import mockKRAs from '../../../common/mockData/mockKRAs';
import { IUserModel } from '../../../common/types/user';
import { log } from '../../../common/utils/customConsoleLog';
import { sortBy } from '../../../common/utils/sharedFunctions';
import CommandButton from '../../../components/commands/CommandButton';
import { getSingleCommand } from '../../../components/commands/commands';
import { actionManager } from '../../../components/commands/uiActions';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useGetAllGoalsByAppraisalIdOldQuery } from '../../../features/goalsOld/goalService';
import { IGoalModel } from '../../../features/goalsOld/types';
import { RootState, useAppDispatch, useTypedSelector } from '../../../store';
import OverviewPage from './OverviewPage';

const AppraisalReviewWrapper = (props: { currentUserUPN: string }): JSX.Element => {
   let allKeyResultAreas = mockKRAs;
   const { t, i18n } = useTranslation();
   const { userUPN } = useParams<{ userUPN: string }>();
   const { pathname } = useLocation();
   const [isValid, setIsValid] = useState(false);
   const [activeKeyResultAreaIndex, setActiveKeyResultAreaIndex] = useState(0);
   const [totalReviewRequired, setTotalReviewRequired] = useState(0);


   const submitGoalsOverviewReviewAction = actionManager(pathname).getSingleAction('SubmitGoalsOverviewReview');
   let submitGoalsOverviewReviewCommand = submitGoalsOverviewReviewAction.getCommand();
   const [originalPath, setOriginalPath] = useState(submitGoalsOverviewReviewCommand!.value.path);

   const dispatch = useAppDispatch();
   let selectedGoalBatch = useTypedSelector((state: RootState) => state.oldGoalBatch);
   let activeKeyResultAreaId = useTypedSelector((state: RootState) => state.keyResultArea.itemId);

   useEffect(() => {
      log('setTotalReviewRequired');
      setIsValid(selectedGoalBatch.find(x => x.outcome === '' || x.comments.length < 2) ? false : true);
      setTotalReviewRequired(selectedGoalBatch.filter(x => x.outcome === 'requiresReview').length);
   }, [selectedGoalBatch]);

   useEffect(() => {
      log('setActiveKeyResultAreaIndex');
      setActiveKeyResultAreaIndex(allKeyResultAreas.findIndex(x => x.id === activeKeyResultAreaId));
   }, [activeKeyResultAreaId, allKeyResultAreas]);

   // #region - User Event Handlers
   const searchQuery = useTypedSelector((state: RootState) => state.filters.searchBox);
   const selectedAppraisalPeriod = useTypedSelector((state: RootState) => state.appraisalPeriod.item);
   // const selectedDateRangeFilter = useTypedSelector((state: RootState) => state.filters.dateRange);
   const selectFilterResults = useMemo(() => {
      // Return a unique selector instance for this page so that
      // the filtered results are correctly memoized
      return createSelector(
         (res: any) => res.data,
         (data) => {
            let dataResult = data ? data as IGoalModel[] : undefined;

            if (dataResult && selectedAppraisalPeriod.id) {
               dataResult = dataResult.filter(x => x.appraisalPeriodId === selectedAppraisalPeriod.id.toString());
            }

            return dataResult ?
               dataResult.filter((x: IGoalModel) => x.title.toLowerCase().includes(searchQuery))
               : undefined
         }
      )
   }, [selectedAppraisalPeriod, searchQuery])

   //Use the same posts query, but extract only part of its data
   //eslint-disable-next-line
   const { filteredData, error, isLoading, isFetching, refetch } = useGetAllGoalsByAppraisalIdOldQuery(userUPN!, {
      selectFromResult: result => {
         return ({
            ...result,
            filteredData: selectFilterResults(result)
         })
      }
   });
   let items: IGoalModel[] = filteredData || [];
   const selectedUserDisplayName = items.length > 0 ? items[0].userDisplayName : t('error.user.notFound');
   const selectedUserUPN = items.length > 0 ? items[0].userUPN : t('error.user.notFound');

   // #region - User Event Handlers
   const handleOnSubmit = async (event: any) => {
      event.preventDefault();
      microsoftTeams.tasks.submitTask("refresh");
   }

   const handleOnCancel = (event: any) => {
      event.preventDefault();
      microsoftTeams.tasks.submitTask("cancel");
   }

   const handleOnContextNavigate = (event: any, next?: boolean) => {
      event.preventDefault();
      let newIndex = activeKeyResultAreaIndex;
      if (next) {
         newIndex++;
         if (newIndex < allKeyResultAreas.length) {
            setActiveKeyResultAreaIndex(newIndex);
            // dispatch(kraSectionChanged(allKeyResultAreas[newIndex].id));
         }
      } else {
         newIndex--;
         if (newIndex >= 0) {
            setActiveKeyResultAreaIndex(newIndex);
            // dispatch(kraSectionChanged(allKeyResultAreas[newIndex].id));
         }
      }
   }
   // #endregion - User Event Handlers


   let newPath = originalPath.concat(totalReviewRequired === 0 ? 'approve' : 'reject');
   let outcomePath = items.length > 0 ? items[0].batchId.concat(totalReviewRequired === 0 ? '' : `?reqRev=${totalReviewRequired}`) : 'mygoals/error';
   submitGoalsOverviewReviewCommand!.displayName = t('common:button.submit');
   submitGoalsOverviewReviewCommand!.value.path = newPath;

   if (!props.currentUserUPN) {
      return (
         <ErrorMessage message={t('error.goals.empty')} messageDetails={`GoalBatchReviewWrapper: items is empty`}>
            <Text content={`currentUserUPN: ${props.currentUserUPN}`} />
            <Text content={`userUPN: ${userUPN}`} />
            <Text content={`total allKeyResultAreas: ${allKeyResultAreas.length}`} />
            <Text content={`total selectedGoalBatch: ${selectedGoalBatch.length}`} />
            <Text content={`activeKeyResultAreaIndex: ${activeKeyResultAreaIndex}`} />
            <Text content={`searchQuery: ${userUPN}`} />
            <Text content={`selectedAppraisalPeriod: ${JSON.stringify(selectedAppraisalPeriod)}`} />
         </ErrorMessage>
      )
   }

   let selectedUser: Partial<IUserModel> = {
      title: selectedUserDisplayName,
      upn: selectedUserUPN
   }


   return (
      <>{isLoading ? (
         <Loader label={t(`loading`)} style={{ margin: 100 }} />
      ) : (
         <>
            <OverviewPage isLoading={isLoading} items={items.sort((a, b) => sortBy(a.kraId, b.kraId))} user={selectedUser} />
            <Segment className={"mmt-footer-container"}>
               {/* <Text content={`${submitGoalsOverviewReviewCommand!.value.path}/${outcomePath}`} /> */}
               <Flex fill hAlign="end" gap="gap.small">
                  {isValid && (activeKeyResultAreaIndex === allKeyResultAreas.length - 1) ?
                     <>
                        <Button
                           content={t('common:button.cancel')}
                        />
                        <CommandButton command={submitGoalsOverviewReviewCommand!} itemId={outcomePath} primary disabled={!isValid} hideIcon />
                     </> :
                     <>
                        <Button
                           content={t('common:button.previous')}
                           onClick={(event) => handleOnContextNavigate(event)}
                           disabled={(activeKeyResultAreaIndex === 0)}
                        />
                        <Button
                           content={t('common:button.next')}
                           tinted
                           onClick={(event) => handleOnContextNavigate(event, true)}
                           disabled={(activeKeyResultAreaIndex === allKeyResultAreas.length - 1)}
                        />
                     </>}
               </Flex>
            </Segment>
         </>
      )}
      </>
   );
}

export default AppraisalReviewWrapper;