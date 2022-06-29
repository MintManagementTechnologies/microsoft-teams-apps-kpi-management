
import { Flex } from "@fluentui/react-northstar";

import CommandButton from "../commands/CommandButton";
import { ICommand } from "../commands/commands";

const CardFooter = (props: {
   itemId: string,
   commands?: ICommand[]
}): JSX.Element => {
   const { itemId, commands } = props;
   const availableCommands = commands || [];

   return (
      <Flex hAlign="end" vAlign="center" fill>
         {availableCommands.map(cmd =>
            <CommandButton itemId={itemId} command={cmd} hideIcon tinted />
         )}
      </Flex>
   );
}

export default CardFooter;