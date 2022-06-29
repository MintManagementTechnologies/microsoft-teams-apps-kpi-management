import { IuiAction } from '..';
import { ICommand } from '../../commands';

export default class AllMyAppraisals implements IuiAction {
   id = 'AllMyAppraisals';
   internalName = 'allMyAppraisals';
   alternativeName = 'me';
   displayName = 'button.appraisal.myAppraisals';
   taskModuleName = '';
   iconName = '';
   eventType = 'link';
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
          id: 690,
          internalName: this.internalName,
          alternativeName: this.alternativeName,
          displayName: this.displayName,
          taskModuleName: this.taskModuleName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "me/myappraisals/browse/1"
          }
      }
   }
}