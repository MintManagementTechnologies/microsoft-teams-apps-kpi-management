import { IuiAction } from '..';
import { ICommand } from '../../commands';

export default class AppraisalOverview implements IuiAction {
   id = 'AppraisalOverview';
   internalName = 'appraisalOverview';
   alternativeName = 'appraisalOverview';
   displayName = 'button.appraisal.overview';
   iconName = 'eye';
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
          id: 888,
          internalName: this.internalName,
          alternativeName: this.alternativeName,
          displayName: this.displayName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "myappraisals/overview"
          }
      }
   }
}