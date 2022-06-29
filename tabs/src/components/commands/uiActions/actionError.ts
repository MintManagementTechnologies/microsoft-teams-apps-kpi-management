import { IuiAction } from '.';
import { ICommand } from '../commands';

export default class ActionError implements IuiAction {
   id = 'ActionError';
   internalName = 'actionError';
   alternativeName = 'actionError';
   displayName = 'button.goal.error';
   iconName = 'default';
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
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "mygoals/error"
          }
      }
   }
}