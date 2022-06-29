import { IuiAction } from '../..';
import { IModalDimensions } from '../../../../../common/utils/configVariables';
import { ICommand } from '../../../commands';

export default class ViewPeriodAction implements IuiAction {
   id = 'ViewPeriod';
   internalName = 'viewPeriod';
   alternativeName = 'viewPeriod';
   displayName = 'View Period';
   taskModuleName = 'modal.hrAdmin.viewPeriod.name';
   iconName = 'eye';
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
          id: 915,
          internalName: this.internalName,
          alternativeName: this.alternativeName,
          displayName: this.displayName,
          taskModuleName: this.taskModuleName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "period/details"
          }
      }
   }
   public static getModalDimensions(action: string = 'view'): IModalDimensions {
      return {
         height: ViewPeriodAction.height,
         width: ViewPeriodAction.width,
      };
   }
}