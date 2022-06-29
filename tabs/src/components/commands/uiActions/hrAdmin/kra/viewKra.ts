import { IuiAction } from '../..';
import { IModalDimensions } from '../../../../../common/utils/configVariables';
import { ICommand } from '../../../commands';

export default class ViewKeyResultAreaAction implements IuiAction {
   id = 'ViewKeyResultArea';
   internalName = 'viewKeyResultArea';
   alternativeName = 'viewKeyResultArea';
   displayName = 'View KRA';
   taskModuleName = 'modal.hrAdmin.viewKeyResultArea.name';
   iconName = 'eye';
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
          id: 915,
          internalName: this.internalName,
          alternativeName: this.alternativeName,
          displayName: this.displayName,
          taskModuleName: this.taskModuleName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "kra/details"
          }
      }
   }
   public static getModalDimensions(action: string = 'view'): IModalDimensions {
      return {
         height: ViewKeyResultAreaAction.height,
         width: ViewKeyResultAreaAction.width,
      };
   }
}