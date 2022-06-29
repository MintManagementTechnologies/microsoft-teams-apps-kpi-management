import { IuiAction } from '../..';
import { IModalDimensions } from '../../../../../common/utils/configVariables';
import { ICommand } from '../../../commands';

export default class NewKeyResultAreaAction implements IuiAction {
   id = 'NewKeyResultArea';
   internalName = 'newKeyResultArea';
   alternativeName = 'newKeyResultArea';
   displayName = 'New KRA';
   taskModuleName = 'modal.hrAdmin.newKeyResultArea.name';
   iconName = 'new';
   eventType = 'taskModule';
   private static height = 500;
   private static width = 679;
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
              path: "kra/new"
          }
      }
   }
   public static getModalDimensions(action: string = 'new'): IModalDimensions {
      return {
         height: NewKeyResultAreaAction.height,
         width: NewKeyResultAreaAction.width,
      };
   }
}