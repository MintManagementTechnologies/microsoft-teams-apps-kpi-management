import { IuiAction } from '..';
import { ICommand } from '../../commands';

export default class DeleteGoal implements IuiAction {
   id = 'DeleteGoal';
   internalName = 'deleteGoal';
   alternativeName = 'deleteGoal';
   displayName = 'button.goal.delete';
   taskModuleName = 'modal.myGoals.delete.name';
   iconName = 'trashcan';
   eventType = 'taskModule';
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
          taskModuleName: this.taskModuleName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "mygoals/delete"
          }
      }
   }
}