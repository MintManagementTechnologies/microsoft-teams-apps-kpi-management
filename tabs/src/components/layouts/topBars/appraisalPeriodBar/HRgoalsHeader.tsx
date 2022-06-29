import { Col, Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { Button, Flex, LikeIcon, Text } from '@fluentui/react-northstar';

import { getRouteParams } from '../../../../common/utils/sharedFunctions';
import AppraisalPeriodFilter from '../../../../features/appraisalPeriods/parts/filters/AppraisalPeriodFilter';
import { IDataTile } from '../../../common/dataTiles/DataTile';
import DataTilesGroup from '../../../common/dataTiles/DataTilesGroup';

const HRgoalsHeader = (props: { loading: boolean }): JSX.Element => {
   const { pathname } = useLocation();
   const { loading } = props;
   const {
      action
   } = getRouteParams(pathname);
   const isBrowseAction = (action === 'browse');


   const tiles: IDataTile[] = [
      {
         tileDisplayName: 'New Submissions',
         tileValue: '23',
         fieldInternalName: 'status',
         fieldFilterValue: 'pending',
         color: 'green'
      },
      {
         tileDisplayName: 'Awaiting HR Approval',
         tileValue: '6',
         fieldInternalName: 'status',
         fieldFilterValue: 'pendingApproval',
         color: 'pink'
      },
      {
         tileDisplayName: 'HR Approved',
         tileValue: '2',
         fieldInternalName: 'status',
         fieldFilterValue: 'approved',
         color: 'grey'
      }
   ]

   return (
      <>
         {loading ? (
            <Flex hAlign='center'>
               <Text content={' '} />
            </Flex>
         ) : (
            <Row key='teamGoalsHeader-row' className='mmt-appraisalPeriodBar' xl={3} lg={3} md={2} sm={1}>
               <Col key='appraisalPeriodBar-col-period' xl={3} lg={3} md={3} sm={12}>
                  <AppraisalPeriodFilter disabled={!isBrowseAction} />
                  {/* <AppraisalPeriodList layout={'dropdown'} displayMode={isBrowseAction ? 'edit' : 'view'} isRootList /> */}
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

export default HRgoalsHeader;