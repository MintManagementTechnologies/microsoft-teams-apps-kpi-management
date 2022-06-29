import { IuiAction } from '..';
import { IModalDimensions } from '../../../../common/utils/configVariables';
import { ICommand } from '../../commands';

export default class SubmitGoalsOverviewReview implements IuiAction {
   id = 'SubmitGoalsOverviewReview';
   internalName = 'submitGoalsOverviewReview';
   alternativeName = 'submitGoalsReview';
   displayName = 'button.goal.submitReview';
   taskModuleName = 'modal.myGoals.approve.name';
   iconName = 'eye';
   eventType = 'taskModule';
   private static height = 691;
   private static width = 680;
   callback?: (params?: any) => void;

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
         taskModuleName: this.taskModuleName,
         iconName: this.iconName,
         type: this.eventType,
         value: {
            path: "mygoals/"
         }
      }
   }
   public static getModalDimensions(action: string = 'new'): IModalDimensions {
      return {
         height: SubmitGoalsOverviewReview.height,
         width: SubmitGoalsOverviewReview.width,
      };
   }
}