import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Checkbox, Flex, Text, TextArea } from '@fluentui/react-northstar';

import { IGoalModel } from '../../../features/goalsOld/types';
import { RootState, useTypedSelector } from '../../../store';

const GoalContainer = (props: { item: IGoalModel }): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { view } = useParams();
   const { item } = props;

   return (
      <>
         <Row>
            <Col>
               <Text content={`${item.title} (${item.kraTitle})`} color={`brand`} className='mmt-goalApproval-KRATitle'/>
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
         <Row className="mmt-checking">
            <Col xl={12} lg={12} md={12} sm={12}>
               <Flex gap="gap.large">
                  <Flex column className="mmt-space">
                     <Text className="mmt-label mmt-themeColorOverride mmt-label" content={`${t('label-weight')} (%)`} />
                     <Text content={item.weight} className='mmt-goalApproval-goalEmphasis' />
                  </Flex>
                  <Flex column className="mmt-space">
                     <Text className="mmt-label mmt-themeColorOverride mmt-label" content={`${t('label-timing')}`} />
                     <Text content={t(`value-timing-${item.timing}`)} className='mmt-goalApproval-goalEmphasis' />
                  </Flex>
               </Flex>
            </Col>
         </Row>
      </>
   );
};

export default GoalContainer;
