import { IuiAction } from '../..';
import { IModalDimensions } from '../../../../../common/utils/configVariables';
import { ICommand } from '../../../commands';

export default class DeletePeriodAction implements IuiAction {
   id = 'DeletePeriod';
   internalName = 'deletePeriod';
   alternativeName = 'deletePeriod';
   displayName = 'Delete Period';
   taskModuleName = 'modal.hrAdmin.deletePeriod.name';
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
              path: "period/delete"
          }
      }
   }
   public static getModalDimensions(action: string = 'delete'): IModalDimensions {
      return {
         height: DeletePeriodAction.height,
         width: DeletePeriodAction.width,
      };
   }
}