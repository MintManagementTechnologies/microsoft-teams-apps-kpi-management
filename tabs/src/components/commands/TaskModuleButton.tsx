import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Button, ButtonProps } from '@fluentui/react-northstar';

// import * as microsoftTeams from "@microsoft/teams-js";
// import { dialog } from '@microsoft/teams-js';
import { getTaskModuleInfo } from '../../common/utils/configVariables';
import CommandIcon from './CommandIcon';
import { ICommand } from './commands';

const TaskModuleButton = (props: {
	itemId: string;
	command: ICommand;
	callback?: () => void;
} & ButtonProps): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { userScope } = useParams();
	const { command, itemId, callback, ...btnProps } = props;
		
   const submitHandler = async (result: any) => {
      if (result === "refresh") {
         //let refresh = dispatch(requestService.endpoints.getAllMyRequests.initiate(currentUserUPN));
         //refresh.refetch();
         //refresh.unsubscribe();
      } else {
         console.log("DONT REFRESH");
      }
   };

   let taskInfo = getTaskModuleInfo(command.taskModuleName, `/${userScope}/${command.value.path}/${itemId}` );
   taskInfo.title = command.taskModuleName ? t(command.taskModuleName) : taskInfo.title;

	const handleOnClick = (event?: any) => {
      if (event !== null) event.preventDefault();
		// dialog.open(taskInfo, submitHandler);
      if(callback) callback();
	};

	return (
		<Button
         {...btnProps}
			className={`mmt-${command.type}-btn mmt-${command.internalName}-btn`}
			content={t(`${command.displayName}`)}
			onClick={(event) => handleOnClick(event)}
		/>
	);
};

export default TaskModuleButton;
