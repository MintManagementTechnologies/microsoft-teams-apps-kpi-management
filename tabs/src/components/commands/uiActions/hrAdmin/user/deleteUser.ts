import { IuiAction } from '../..';
import { IModalDimensions } from '../../../../../common/utils/configVariables';
import { ICommand } from '../../../commands';

export default class DeleteUserAction implements IuiAction {
   id = 'DeleteUser';
   internalName = 'deleteUser';
   alternativeName = 'deleteUser';
   displayName = 'Delete User';
   taskModuleName = 'modal.hrAdmin.deleteUser.name';
   iconName = 'trashcan';
   eventType = 'taskModule';
   private static height = 425;
   private static width = 646;
   callback?:(params?: any) => void;

   constructor(_context: any, _callback?: (params?: any) => void) {
      this.callback = _callback;
   }

   canBeAddedToUI(): boolean {
      return true;
   }

   execute(params?: any): void {
      if (this.callback)
         this.callback(params)
   }

   getCommand(): ICommand {
      return {
          id: 959,
          internalName: this.internalName,
          alternativeName: this.alternativeName,
          displayName: this.displayName,
          taskModuleName: this.taskModuleName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "user/delete"
          }
      }
   }
   public static getModalDimensions(action: string = 'delete'): IModalDimensions {
      return {
         height: DeleteUserAction.height,
         width: DeleteUserAction.width,
      };
   }
}