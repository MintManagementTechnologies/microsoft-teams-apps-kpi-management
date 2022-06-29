import NewCompetencyAction from "./newCompetency";
import EditCompetencyAction from "./editCompetency";
import DeleteCompetencyAction from "./deleteCompetency";
import ViewCompetencyAction from "./viewCompetency";

export const competencyActions = [
   new NewCompetencyAction('topBar'),
   new ViewCompetencyAction('topBar'),
   new EditCompetencyAction('topBar'),
   new DeleteCompetencyAction('topBar')
]