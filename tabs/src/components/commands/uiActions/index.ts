import { ICommand } from '../commands';
import ActionError from './actionError';
import AllMyAppraisals from './appraisal/allMyAppraisals';
import AllTeamAppraisals from './appraisal/allTeamAppraisals';
import AppraisalOverviewAction from './appraisal/appraisalOverview';
import AllMyGoalsAction from './goal/allMyGoals';
import AllTeamGoalsAction from './goal/allTeamGoals';
import DeleteGoalAction from './goal/deleteGoal';
import EditGoalAction from './goal/editGoal';
import GoalConversationAction from './goal/goalConversation';
import GoalMeetingAction from './goal/goalMeeting';
import GoalsOverviewAction from './goal/goalsOverview';
import NewGoalAction from './goal/newGoal';
import SubmitGoalsOverviewReviewAction from './goal/submitGoalsOverviewReview';
import ViewGoalAction from './goal/viewGoal';
import AllAppraisalsAction from './hrAdmin/allAppraisals';
import AllGoalsAction from './hrAdmin/allGoals';
import AllSettingsAction from './hrAdmin/allSettings';
import { competencyActions } from './hrAdmin/competency';
import { kraActions } from './hrAdmin/kra';
import { periodActions } from './hrAdmin/period';
import { userActions } from './hrAdmin/user';

export interface IuiAction {
   id: string;
   internalName: string;
   alternativeName: string;
   displayName?: string;
   taskModuleName?: string;
   iconName: string;
   getCommand(): ICommand;
   canBeAddedToUI(): boolean;
   execute(): void;
}

export const actionManager = (pathName: string) => {
   const allGoalsAction = new AllGoalsAction('topBar');
   const allAppraisalsAction = new AllAppraisalsAction('topBar');
   const allSettingsAction = new AllSettingsAction('topBar');


   const allActions = [
      new AllMyAppraisals('topBar'),
      new AllTeamAppraisals('topBar'),
      new AllMyGoalsAction('topBar'),
      new AllTeamGoalsAction('topBar'),
      new ViewGoalAction('topBar'),
      new EditGoalAction('topBar'),
      new DeleteGoalAction('topBar'),
      new AppraisalOverviewAction('topBar'),
      new GoalsOverviewAction('topBar'),
      new GoalConversationAction('topBar'),
      new GoalMeetingAction('topBar'),
      new NewGoalAction('topBar'),
      new SubmitGoalsOverviewReviewAction('topBar'),
      ...kraActions,
      ...periodActions,
      ...userActions,
      ...competencyActions,
      new ActionError('topBar'),
   ]

   return {
      getSingleAction: (_action: string): IuiAction => {
         let actionError = new ActionError('topBar');
         return allActions.find(x => x.id === _action) || actionError;
      },
      getActions: (_actions: string[] = []): IuiAction[] => {
         return allActions.filter(x => _actions.includes(x.id));
      }
   }
}
/*
type ctxTypes = 'topActionBar' | 'appraisalPeriodBar' | 'tabBody' | 'settingsBody' | 'modal' | 'goal' | 'appraisal' | 'competency' | 'kra' | 'appraisalPeriod' | 'user' | 'all';
const ctx = _ctx;
const groupedByCtx = _groupedByCtx;

const groupedByActionNames = (): string[] => {
   let combinedActionCtx = `${groupedByCtx}-${ctx}s`
   switch (combinedActionCtx) {
      case 'user-goals':
         return ['GoalsOverview', 'ApproveGoalsOverview', 'GoalsOverviewConversation', 'GoalsOverviewMeeting'];
         // If user-goals in HRadminTab, then include "EditUserManagers"
      case 'user-appraisals':
         return ['ViewAppraisal', 'ApproveAppraisal', 'AppraisalConversation', 'AppraisalMeeting'];
         // If user-appraisals in HRadminTab, then include "EditUserManagers"
      default:
         return [];
   }
}

const contextActionNames = (): string[] => {
   switch (_ctx) {
      case 'topActionBar':
         return ["MyGoals", "TeamGoals", "NewGoal", "SubmitGoals", "MyAppraisals", "TeamAppraisals", "AllGoals", "AllApproisals", "AllSettings"];
      case 'appraisalPeriodBar':
         return [];
      case 'tabBody':
         return [];
      case 'settingsBody':
         return ["NewKeyResultArea", "NewCompetency", "NewPeriod", "NewUser"];
      case 'modal':
         return [];
      case 'goal':
         return ["ViewGoal", "EditGoal", "DeleteGoal", "GoalConversation", "GoalMeeting"];
      case 'appraisal':
         return ["ViewAppraisal", "EditAppraisal"];
      case 'competency':
         return ["EditCompetency", "ArchiveCompetency"];
      case 'kra':
         return ["EditKeyResultArea", "ArchiveKeyResultArea"];
      case 'appraisalPeriod':
         return ["EditPeriod", "SendReminders"];
      case 'user':
         return ["EditUser", "DeleteUser"];
      case 'all':
         return [];
      default:
         return [];
   }
}

const allContextActionNames = (): string[] => {
   if(groupedByCtx)
      return groupedByActionNames();
   return contextActionNames();
}
*/