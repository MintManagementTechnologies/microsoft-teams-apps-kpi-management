import { Button, ButtonProps } from "@fluentui/react-northstar";
import React from "react";
import { Link } from "react-router-dom";
import CommandIcon from "./CommandIcon";
import { ICommand } from "./commands";
import EventButton from "./EventButton";
import LinkButton from "./LinkButton";
import TaskModuleButton from "./TaskModuleButton";



const CommandButton = (props: {
   itemId?: string;
   command: ICommand;
   hideIcon?: boolean;
   callback?: () => void;
} & ButtonProps): JSX.Element => {
   const { command, itemId, hideIcon, callback, ...btnProps } = props;
   if(!command) {
      debugger;
   }
   const id = itemId ? itemId : '';
   const icon = hideIcon ? undefined : <CommandIcon name={command.iconName} />;
   
   return (
      <>
         {command.type === "event" ?
            // (<EventButton command={command} itemId={id} callback={callback!} />)
            (<EventButton {...btnProps} icon={icon} command={command} itemId={id} callback={callback!} />)
            : command.type === "taskModule" ?
               (<TaskModuleButton {...btnProps} icon={icon} command={command} itemId={id} callback={callback!} />)
               : 
               (<LinkButton {...btnProps} icon={icon} command={command} itemId={id} />)
         }
      </>
   );
};

export default CommandButton;
