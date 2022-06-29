import { IuiAction } from '..';
import { ICommand } from '../../commands';

export default class AllAppraisalsAction implements IuiAction {
   id = 'allAppraisals';
   internalName = 'allAppraisals';
   alternativeName = 'appraisals';
   displayName = 'Appraisals';
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
          id: 989,
          internalName: this.internalName,
          alternativeName: this.alternativeName,
          displayName: this.displayName,
          iconName: this.iconName,
          type: this.eventType,
          value: {
              path: "myappraisals/browse"
          },
          availableIn: {
              views: ["allappraisals"],
              scopes: ["card", "contextNav", "taskModule"],
              statuses: ["created", "inProgress", "complete"]
          }
      }
   }
}

// export const allAppraisals = (context: any, callback?: (params?: any) => void): IuiAction => {
//    const id = '';
//    const internalName = '';
//    const alternativeName = '';
//    const displayName = '';
//    const iconName = '';
//    const eventType = 'routerLink';

//    return {
//       id: id,
//       internalName: internalName,
//       alternativeName: alternativeName,
//       displayName: displayName,
//       iconName: iconName,
//       canBeAddedToUI: (): boolean => {
//          return true;
//       },
//       execute: (params?: any) => {
//          if (callback)
//             callback(params)
//       }
//    }
// }