import NewPeriodAction from "./newPeriod";
import EditPeriodAction from "./editPeriod";
import DeletePeriodAction from "./deletePeriod";
import ViewPeriodAction from "./viewPeriod";

export const periodActions = [
   new NewPeriodAction('topBar'),
   new ViewPeriodAction('topBar'),
   new EditPeriodAction('topBar'),
   new DeletePeriodAction('topBar')
]