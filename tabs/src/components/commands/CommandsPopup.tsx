import { useState } from "react";
import { Button, Flex, MoreIcon, Popup, } from "@fluentui/react-northstar";
import { ICommand } from "./commands";
import CommandButton from "./CommandButton";

const CommandsPopup = (props: { itemId: string, commands?: ICommand[] }): JSX.Element => {
   const { itemId, commands } = props;
   const availableCommands = commands || [];

   const [open, setOpen] = useState(false);
   const closePopup = () => {
      setOpen(false);
   }

   return (
      <Popup
         on="focus"
         key={`command-popup-${itemId}`}
         content={
            <Flex column key={`commands-content-${itemId}`} hAlign="start">
               {availableCommands.map((x) => {
                  return (
                     <CommandButton
                        key={`mItem-${x.internalName}-${itemId}`}
                        command={x}
                        itemId={itemId}
                        callback={closePopup}
                        text
                     />
                  );
               })}
            </Flex>
         }
         position={'below'}
         trigger={<Button icon={<MoreIcon />} text iconOnly title="More" />}
         onOpenChange={(e, { open }: any) => setOpen(open)}
         open={open}
      />
   );
};

export default CommandsPopup;
