import { IuiAction } from '..';
import { ICommand } from '../../commands';

export default class AllSettingsAction implements IuiAction {
   id = 'allSettings';
   internalName = 'allSettings';
   alternativeName = 'kraManagement';
   displayName = 'KRA Management';
   iconName = 'hand';
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
          id: 979,
          internalName: this.internalName,
          alternativeName: this.alternativeName,
          displayName: this.displayName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "settings/krabrowse"
          }
      }
   }
}