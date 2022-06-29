import { useState } from "react";
import { Button, Flex, SplitButton, } from "@fluentui/react-northstar";
import { getSingleCommand, ICommand } from "./commands";
import CommandButton from "./CommandButton";
import { useTranslation } from "react-i18next";

const CommandsSplitButton = (props: { itemId?: string, index?: number, commands: ICommand[], 
   menuButtonClickCallback?: (cmd: ICommand) => void }): JSX.Element => 
{
   const { t, i18n } = useTranslation();
   const { itemId, index, commands, menuButtonClickCallback } = props;
   const availableCommands = commands || [];

	const enabled = true;
   const commandButtons = availableCommands.map((cmd: ICommand) => ({
      key: cmd.id,
      content: t(cmd.displayName!)
   }));

   const [open, setOpen] = useState(false);
   const [activeIndex, setActiveIndex] = useState(index || 0);

   const closePopup = () => {
      setOpen(false);
   }

	const handleOnMenuButtonClick = (index: any) => {
		setActiveIndex(index);
		if(menuButtonClickCallback){
			menuButtonClickCallback(availableCommands[index]);
      }
	}

	const handleOnMainButtonClick = (event:any) => {
      if (event !== null)
          event.preventDefault();
      //if(props.onMainButtonClickCallback)
         //props.onMainButtonClickCallback(e, activeAction.key)
		//setActiveIndex(index);
		
		//	props.onMenuItemClickCallback(actionItems[index].key);
	}   

   const activeAction = commandButtons[activeIndex];

	return (
		<SplitButton
			button={activeAction}
			menu={commandButtons}
			onMenuItemClick={(event, { index }: any) => {
				handleOnMenuButtonClick(index)
			}}
			disabled={!enabled}
			toggleButton={{
				disabled: false
			}}
			primary
		/>
	);
};

export default CommandsSplitButton;