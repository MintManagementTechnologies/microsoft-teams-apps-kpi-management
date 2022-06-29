import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button, Flex, Segment } from '@fluentui/react-northstar';

import BreadcrumbNav from '../../components/common/BreadcrumbNav';
import { itemIdChanged, selectAllGoalKRAs } from '../../features/keyResultAreas/keyResultAreaSlice';
import KeyResultAreaContextNav from '../../features/keyResultAreas/parts/contextNav/KraContextNav';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';

const BrowseGoalReviewsLayout = (props: { userDisplayName: string, disableNextBtn: boolean, completeReviewBtn: React.ReactNode, children?: React.ReactNode }): JSX.Element => {
   const { userDisplayName, disableNextBtn, completeReviewBtn } = props;
   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();
   const [activeKeyResultAreaIndex, setActiveKeyResultAreaIndex] = useState(0);
   const selectedAllGoalKRAs = useSelector(selectAllGoalKRAs);
   const selectedKRA = useTypedSelector((state: RootState) => state.keyResultArea.itemId);

   useEffect(() => {
      if (!selectedKRA) return;
      const selectedKraIndex = selectedAllGoalKRAs.findIndex(x => x.id === selectedKRA);
      setActiveKeyResultAreaIndex(selectedKraIndex);
   }, [selectedKRA])

   // #startregion - User Event Handlers
   const handleOnContextNavigate = (event: any, next?: boolean) => {
      event.preventDefault();
      let newIndex = activeKeyResultAreaIndex;
      if (next) {
         newIndex++;
         if (newIndex < selectedAllGoalKRAs.length) {
            setActiveKeyResultAreaIndex(newIndex);
            dispatch(itemIdChanged(selectedAllGoalKRAs[newIndex].id));
         }
      } else {
         newIndex--;
         if (newIndex >= 0) {
            setActiveKeyResultAreaIndex(newIndex);
            dispatch(itemIdChanged(selectedAllGoalKRAs[newIndex].id));
         }
      }
   }
   // #endregion - User Event Handlers

   return (
      <Flex fill column gap={'gap.small'} className={`mmt-container-goalBatchReview`}>
         {/* <Row className='mmt-rowGutter-10'>
            <Col>
               <BreadcrumbNav currentNode={userDisplayName} />
            </Col>
         </Row> */}
         <Row className='mmt-row-goalBatchReview'>
            <Col xl={3} lg={3} md={2} sm={12} className="gx-0">
               <BreadcrumbNav currentNode={userDisplayName} />
               <KeyResultAreaContextNav items={selectedAllGoalKRAs.map(x => ({ id: x.id, title: `${x.title} (${x.groupByTotal}%)` }))} />
            </Col>
            <Col key='goalsApprovalStatusBar-row' xl={9} lg={9} md={10} sm={12} className="gx-5 mmt-col-content mmt-col-browseUserGoalBatch">
               {/* <BrowseGoalReviews isLoading={false} items={dataGetGoalsByBatchId || selectedGoals} employeeId={parseInt(userId)} /> */}

               {/* <BrowseGoalReviews isLoading={false} items={items} employeeId={parseInt(userId)} /> */}
               {props.children}
            </Col>
         </Row>
         <Segment className={"mmt-footer-container"}>
            {/* <Text content={`${submitGoalsOverviewReviewCommand!.value.path}/${outcomePath}`} /> */}
            <Flex fill hAlign="end" gap="gap.small">
               {(activeKeyResultAreaIndex === selectedAllGoalKRAs.length - 1) ?
                  <>
                     <Button
                        content={t('common:button.previous')}
                        onClick={(event) => handleOnContextNavigate(event)}
                        disabled={(activeKeyResultAreaIndex === 0)}
                     />
                     {completeReviewBtn}
                     {/* <ApproveGoalBatchBtn disabled={disableNextBtn} usersUPN={usersUPN} /> */}
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
                        disabled={disableNextBtn}
                     />
                  </>}
            </Flex>
         </Segment>
      </Flex>
   );
}

export default BrowseGoalReviewsLayout;