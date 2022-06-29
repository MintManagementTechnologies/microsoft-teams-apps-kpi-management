import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Button, ButtonProps } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';

// import { dialog } from '@microsoft/teams-js';
import { getBaseUrl } from '../../../common/utils/sharedFunctions';

const TaskModuleButton = (props: {
   title: string,
   path: string,
   callback?: (result: {action: string, additionalInfo: any}) => void,
} & ButtonProps): JSX.Element => {
   const { title, path, callback, ...btnProps } = props;

   const submitHandler = async (err:any, result: any) => {
      if (props.callback) {
         props.callback(result);
      }
   };

   // const taskModuleInfo = {
   //    size: {
   //       height: 400,
   //       width: 500,
   //    },
   //    title: title,
   //    url: `${getBaseUrl()}/${path}`
   // }

   const taskModuleInfo = {
      height: 400,
      width: 500,
      title: title,
      url: `${getBaseUrl()}/${path}`
   }

   const handleOnClick = (event?: any) => {
      if (event !== null) event.preventDefault();
      // dialog.open(taskModuleInfo, submitHandler);
      microsoftTeams.tasks.startTask(taskModuleInfo, submitHandler);
   };

   return (
      <Button
         {...btnProps}
         className={`mmt-taskModule-btn`}
         onClick={(event) => handleOnClick(event)}
      />
   );
};

export default TaskModuleButton;
