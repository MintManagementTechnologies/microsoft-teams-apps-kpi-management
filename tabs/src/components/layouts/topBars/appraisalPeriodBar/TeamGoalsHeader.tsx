import { Col, Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { Button, Flex, LikeIcon, Text } from '@fluentui/react-northstar';

import { getRouteParams } from '../../../../common/utils/sharedFunctions';
import AppraisalPeriodFilter from '../../../../features/appraisalPeriods/parts/filters/AppraisalPeriodFilter';
import { IDataTile } from '../../../common/dataTiles/DataTile';
import DataTilesGroup from '../../../common/dataTiles/DataTilesGroup';

const TeamGoalsHeader = (props: { loading: boolean }): JSX.Element => {
   const { pathname } = useLocation();
   const { loading } = props;
   const {
      action
   } = getRouteParams(pathname);
   const isBrowseAction = (action === 'browse');
   const isReviewPage = (action === 'batch');


   const tiles: IDataTile[] = [
      {
         tileDisplayName: 'Submitted',
         tileValue: '2',
         fieldInternalName: 'status',
         fieldFilterValue: 'pending',
         color: 'green'
      },
      {
         tileDisplayName: 'Awaiting Approval',
         tileValue: '1',
         fieldInternalName: 'status',
         fieldFilterValue: 'pendingApproval',
         color: 'pink'
      },
      {
         tileDisplayName: 'Approved',
         tileValue: '1',
         fieldInternalName: 'status',
         fieldFilterValue: 'approved',
         color: 'grey'
      }
   ]

   const smallSizeClass = isReviewPage ? 'mmt-divider-only' : '';
   return (
      <>
         {loading ? (
            <Flex hAlign='center'>
               <Text content={' '} />
            </Flex>
         ) : (
            <Row key='teamGoalsHeader-row' className={`mmt-appraisalPeriodBar ${smallSizeClass}`} xl={3} lg={3} md={2} sm={1}>
               <Col key='appraisalPeriodBar-col-period' xl={3} lg={3} md={3} sm={12}>
                  {!isReviewPage && <AppraisalPeriodFilter disabled={!isBrowseAction} />}
               </Col>
               <Col key='teamGoalsHeader-col-goalsStage' xl={9} lg={9} md={9} sm={12}>
                  <Flex vAlign={'center'} hAlign={'end'} fill className='mmt-teamGoalsHeader-container'>
                     {/* <DataTilesGroup loading={loading} data={tiles} filterable={isBrowseAction} /> */}
                  </Flex>
               </Col>
            </Row>
         )}
      </>
   );
}

export default TeamGoalsHeader;