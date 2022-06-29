import * as React from 'react';
import {Flex,Text} from "@fluentui/react-northstar";
import { useLocation, useParams } from "react-router-dom";
import CommandsPopup from "../commands/CommandsPopup";
import { ICommand } from '../commands/commands';
import { actionManager, IuiAction } from '../commands/uiActions';

const CardHeader = (props: { title?: string, subtitle?: string, itemdId: string, commands?: ICommand[] }): JSX.Element => {
   const { view } = useParams();

   const { title, subtitle, itemdId, commands } = props;

   return (
      <Flex>
         <Flex column fill>
            <Text content={title} weight="bold" className="mmt-title" color='brand' />
            <Text
               content={`${subtitle}`}
               size="small"
               timestamp
               className="mmt-subtitle"
            />
         </Flex>
         <Flex hAlign="end" gap="gap.small">
            <CommandsPopup itemId={itemdId} commands={commands} />
         </Flex>
      </Flex>
   );
};

export default CardHeader;
