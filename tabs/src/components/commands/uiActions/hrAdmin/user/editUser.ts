import { IuiAction } from '../..';
import { IModalDimensions } from '../../../../../common/utils/configVariables';
import { ICommand } from '../../../commands';

export default class EditUserAction implements IuiAction {
   id = 'EditUser';
   internalName = 'editUser';
   alternativeName = 'editUser';
   displayName = 'Edit User';
   taskModuleName = 'modal.hrAdmin.editUser.name';
   iconName = 'pencil';
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
              path: "user/edit"
          }
      }
   }
   public static getModalDimensions(action: string = 'edit'): IModalDimensions {
      return {
         height: EditUserAction.height,
         width: EditUserAction.width,
      };
   }
}