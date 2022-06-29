import { IuiAction } from '../..';
import { IModalDimensions } from '../../../../../common/utils/configVariables';
import { ICommand } from '../../../commands';

export default class EditKeyResultAreaAction implements IuiAction {
   id = 'EditKeyResultArea';
   internalName = 'editKeyResultArea';
   alternativeName = 'editKeyResultArea';
   displayName = 'Edit KRA';
   taskModuleName = 'modal.hrAdmin.editKeyResultArea.name';
   iconName = 'pencil';
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
              path: "kra/edit"
          }
      }
   }
   public static getModalDimensions(action: string = 'edit'): IModalDimensions {
      return {
         height: EditKeyResultAreaAction.height,
         width: EditKeyResultAreaAction.width,
      };
   }
}