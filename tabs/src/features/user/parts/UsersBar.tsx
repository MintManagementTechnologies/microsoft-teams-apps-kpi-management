import './UsersBar.scss';

import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Flex, Pill, Text } from '@fluentui/react-northstar';

import ViewUser from '../ViewUser';

const UsersBar = (props: { userUPNs: string[] }): JSX.Element => {
   const { userUPNs } = props;
   const { t } = useTranslation();

   return (
      <Flex className='mmt-goalsApprovalStatusBar mmt-rowGutter-10'>
         {(userUPNs).map((x: string, i: number) => (
            <Col key={`goalsApprovalStatusBar-col-user-${i}`} >
               <Flex fill vAlign='center' className={`mmt-userRole-container`} gap='gap.medium'>
                  <Pill className={`mmt-statusPill userRole`}>
                     {i === 0 ?
                        <Text content={t('common:userRole.createdBy')} />
                        :
                        <Text content={`${t('common:userRole.manager')} ${i}`} />
                     }
                  </Pill>
                  <ViewUser size='small' userId={x} showJobTitle/>
               </Flex>
            </Col>)
         )}
      </Flex>
   );
}

export default UsersBar;