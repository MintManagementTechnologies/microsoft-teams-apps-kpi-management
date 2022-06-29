import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '@fluentui/react-northstar';

import { IAppraisalGoalModel } from '../../features/appraisals/types';
import { IGoalBatchItemModel } from '../../features/goalBatches/types';

const GoalDetailsBox = (props: { item: IGoalBatchItemModel | IAppraisalGoalModel }): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { item } = props;

   return (
      <>
         <Row>
            <Col>
               {/* <Text content={`${item.title} (${item.kraTitle})`} color={`brand`} className='mmt-goalApproval-KRATitle'/> */}
            </Col>
         </Row>
         <Row xl={2} lg={2} md={2} sm={1}>
            <Col>
               <Flex gap="gap.small" column fill>
                  <Text content={`${t('formLabel-goalDescription')}`} className='mmt-label' />
                  <Text content={item.description} className='mmt-goalApproval-goalText' />
               </Flex>
            </Col>
            <Col>
               <Flex gap="gap.small" column fill>
                  <Text content={`${t('formLabel-achievementCriteria')}`} className='mmt-label' />
                  <Text content={item.achievementCriteria} className='mmt-goalApproval-goalText' />
               </Flex>
            </Col>
         </Row>
         <Row className="mmt-weight-timing-container">
            <Col xl={12} lg={12} md={12} sm={12}>
               <Flex gap="gap.large">
                  <Flex column className="mmt-weight-container mmt-smallValue-container">
                     <Text className="mmt-label mmt-themeColorOverride mmt-label" content={`${t('label-weight')} (%)`} />
                     <Text content={item.weight} className='mmt-goalApproval-goalEmphasis' />
                  </Flex>
                  <Flex column className="mmt-timing-container mmt-smallValue-container">
                     <Text className="mmt-label mmt-themeColorOverride mmt-label" content={`${t('label-timing')}`} />
                     <Text content={t(`value-timing-${item.timing}`)} className='mmt-goalApproval-goalEmphasis' />
                  </Flex>
               </Flex>
            </Col>
         </Row>
      </>
   );
};

export default GoalDetailsBox;
