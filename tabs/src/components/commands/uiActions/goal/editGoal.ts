import { IuiAction } from '..';
import { ICommand } from '../../commands';

export default class EditGoal implements IuiAction {
   id = 'EditGoal';
   internalName = 'viewGoal';
   alternativeName = 'viewGoal';
   displayName = 'button.goal.edit';
   taskModuleName = 'modal.myGoals.edit.name';
   iconName = 'pencil';
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
              path: "mygoals/edit"
          }
      }
   }
}