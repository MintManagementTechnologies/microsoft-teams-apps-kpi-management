import { IuiAction } from '../..';
import { IModalDimensions } from '../../../../../common/utils/configVariables';
import { ICommand } from '../../../commands';

export default class NewUserAction implements IuiAction {
   id = 'NewUser';
   internalName = 'newUser';
   alternativeName = 'newUser';
   displayName = 'New User';
   taskModuleName = 'modal.hrAdmin.newUser.name';
   iconName = 'new';
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
          id: 939,
          internalName: this.internalName,
          alternativeName: this.alternativeName,
          displayName: this.displayName,
          taskModuleName: this.taskModuleName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "user/new"
          }
      }
   }
   public static getModalDimensions(action: string = 'new'): IModalDimensions {
      return {
         height: NewUserAction.height,
         width: NewUserAction.width,
      };
   }
}