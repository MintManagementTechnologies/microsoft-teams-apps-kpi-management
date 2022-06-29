import { IuiAction } from '..';
import { ICommand } from '../../commands';

export default class AllTeamGoals implements IuiAction {
   id = 'AllTeamGoals';
   internalName = 'allTeamGoals';
   alternativeName = 'team';
   displayName = 'button.goal.teamGoals';
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
          id: 691,
          internalName: this.internalName,
          alternativeName: this.alternativeName,
          displayName: this.displayName,
          taskModuleName: this.taskModuleName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "team/mygoals/browse/1"
          }
      }
   }
}