import {
	Button,
	ButtonProps,
	Loader,
} from "@fluentui/react-northstar";
import { ICommand } from "./commands";
import CommandIcon from "./CommandIcon";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const EventButton = (props: {
	itemId: string;
	command: ICommand;
	callback: () => void;
} & ButtonProps): JSX.Element => {
   const { t, i18n } = useTranslation();
	const [isLoadingCommand, setIsLoadingCommand] = useState(false);
	const { command, itemId, callback, ...btnProps } = props;
	
	useEffect(() => {
		if(isLoadingCommand){
			setTimeout(() => {
				setIsLoadingCommand(false)
			}, 1000);	
		}
	},[isLoadingCommand]);

	const handleOnClick = (event?: any) => {
      if (event !== null) event.preventDefault();
		if (command.type === 'event') {
			setIsLoadingCommand(true);
			//await dispatch(botService.endpoints.sendReminder.initiate(_itemId));
		}
		callback();
	};

	return (
		<>
		{isLoadingCommand ? (<Loader size='small'/>) :
		(<Button
            {...btnProps}
            fluid
            className={`mmt-${command.type}-btn`}
            content={t(`${command.displayName}`)}
            onClick={(event) => handleOnClick(event)}
         />)}
		</>
	);
};

export default EventButton;
