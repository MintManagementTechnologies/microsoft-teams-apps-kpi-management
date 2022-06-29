import * as React from 'react';
import { Flex, Text, Button, LikeIcon } from "@fluentui/react-northstar";
import { Row, Col, Container } from 'react-bootstrap';
import { useLocation } from "react-router-dom";

export interface IDataTile {
   tileDisplayName: string;
   tileValue: string;
   fieldInternalName: string;
   fieldFilterValue?: string;
   color: string
}

const GoalBatchStatusIndicator = (props: {
   content: string,
   status: string
}): JSX.Element => {
   const { content, status } = props;

   let icon = <></>;

   switch (status) {
      case 'complete':
         icon =
            <LikeIcon circular styles={
               ({ theme: { siteVariables } }) => ({
                  color: siteVariables.colorScheme.brand.foreground,
                  backgroundColor: '#fff',
                  padding: '8px'
               })}
            />
         break;
      case 'rejected':
         icon =
            <LikeIcon circular styles={
               ({ theme: { siteVariables } }) => ({
                  color: '#fff',
                  backgroundColor: siteVariables.colorScheme.brand.foreground,
                  padding: '8px',
                  transform: 'scaleX(-1) rotate(180deg)'
               })}
            />
         break;
      default:
         icon =
            <LikeIcon disabled circular styles={
               ({ theme: { siteVariables } }) => ({
                  backgroundColor: '#EDEBE9',
                  padding: '8px',
                  transform: 'scaleX(-1) rotate(180deg)'
               })}
            />
         break;
   }

   return (
      <Flex gap='gap.medium' vAlign={'center'} >
         {icon}
         <Text content={content} size={'large'} className={'mmt-userGoalsHeader-label'} />
      </Flex>
   );
}

export default GoalBatchStatusIndicator;