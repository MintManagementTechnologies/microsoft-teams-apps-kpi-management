import SubmitGoalsOverviewReview from '../../components/commands/uiActions/goal/submitGoalsOverviewReview';
import NewCompetencyAction from '../../components/commands/uiActions/hrAdmin/competency/newCompetency';
import NewKeyResultAreaAction from '../../components/commands/uiActions/hrAdmin/kra/newKra';
import NewPeriodAction from '../../components/commands/uiActions/hrAdmin/period/newPeriod';
import NewUserAction from '../../components/commands/uiActions/hrAdmin/user/newUser';
import { log } from './customConsoleLog';
import i18n from './i18n';
import { getBaseUrl } from './sharedFunctions';

export const { graphScope } = { graphScope: ["User.Read", "User.ReadBasic.All", "Presence.Read.All", "Sites.ReadWrite.All"] };

export interface IReviewLevel {
   internalName: string
   displayName: string,
}
export const reviewLevels: IReviewLevel[] = [
   {
      internalName: 'createdBy',
      displayName: 'createdBy'
   },
   {
      internalName: 'line1',
      displayName: 'manager'
   },
   {
      internalName: 'line2',
      displayName: 'manager'
   },
   {
      internalName: 'hr',
      displayName: 'hr'
   }
];

export const getStatusAndApprovalLevel = (_status: string = 'saved') => {
   let currentLevel = 0;
   let currentStatus = 'pending';

   const status = _status.toLowerCase();
   switch (status) {
      case 'line1':
         currentLevel = 1;
         break;
      case 'line2':
         currentLevel = 2;
         break;
      case 'hr':
         currentLevel = 3;
         break;
      case 'approved':
         currentLevel = 0;
         currentStatus = 'approved';
         break;
      case 'completed':
         currentLevel = 0;
         currentStatus = 'approved';
         break;
      case 'returned':
         currentLevel = 0;
         currentStatus = 'rejected';
         break;
      case 'saved':
         currentLevel = 0;
         currentStatus = 'draft';
         break;
      default:
         break;
   }
   return { currentLevel, currentStatus };
}

export const getStatusPillPrefix = (_level: number) => {
   if (_level === 0 || _level >= reviewLevels.length) return;
   const suffixContent = _level !== (reviewLevels.length - 1) ? ` ${_level}:` : `:`;
   const statusContent = `${i18n.t(`common:userRole.${reviewLevels[_level].displayName}`)}${suffixContent}`;
   return statusContent;
}

export interface IModalDimensions {
   height: number,
   width: number,
};

export interface IModalProperties {
   size: {
      height: number,
      width: number,
   }
   title: string
};

interface ITaskModuleInfo extends IModalProperties {
   url: string,
};

const getModalProperties = (action: string): IModalDimensions => {
   switch (action) {
      case "modal.myGoals.new.name":
      case "new":
         return {
            height: 691,
            width: 680,
            // title: 'Goal Details Form'
         };
      case "edit":
         return {
            height: 691,
            width: 680,
            // title: 'Goal Details Form'
         };
      case "details":
         return {
            height: 691,
            width: 680,
            // title: 'Goal Details'modal.hrAdmin.newKeyResultArea.name
         };
      case "modal.name.submitReview":
         return SubmitGoalsOverviewReview.getModalDimensions();
      case "modal.hrAdmin.newPeriod.name":
      case "modal.hrAdmin.viewPeriod.name":
      case "modal.hrAdmin.editPeriod.name":
      case "modal.hrAdmin.deletePeriod.name":
         return NewPeriodAction.getModalDimensions();
      case "modal.hrAdmin.newCompetency.name":
      case "modal.hrAdmin.viewCompetency.name":
      case "modal.hrAdmin.editCompetency.name":
      case "modal.hrAdmin.deleteCompetency.name":
         return NewCompetencyAction.getModalDimensions();
      case "modal.hrAdmin.newKeyResultArea.name":
      case "modal.hrAdmin.viewKeyResultArea.name":
      case "modal.hrAdmin.editKeyResultArea.name":
      case "modal.hrAdmin.deleteKeyResultArea.name":
         return NewKeyResultAreaAction.getModalDimensions();
      case "modal.hrAdmin.newUser.name":
      case "modal.hrAdmin.viewUser.name":
      case "modal.hrAdmin.editUser.name":
      case "modal.hrAdmin.deleteUser.name":
         return NewUserAction.getModalDimensions();
      case "error.modal.name":
         return {
            height: 500,
            width: 500,
            // title: 'Add new User'
         };
      default:
         return {
            height: 1000,
            width: 1000,
            // title: 'DEFAULT'
         };
   }
}

export const getTaskModuleInfo = (_action: string = 'error.modal.name', _path: string): ITaskModuleInfo => {
   const modalProps = getModalProperties(_action);
   return {
      url: getBaseUrl() + `${_path}`,
      title: _action,
      size: {
         height: modalProps.height,
         width: modalProps.width,
      }
   };
};