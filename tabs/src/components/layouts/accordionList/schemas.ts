import { headerBlank } from "./fieldColumns/DefaultColumn";
import { headerUser, headerManager1, headerManager2 } from "./fieldColumns/UserColumn";
import { headerItemActions } from "./fieldColumns/ItemActionsColumn";
import { headerPriority } from "./fieldColumns/PriorityColumn";
import { headerStatus } from "./fieldColumns/StatusColumn";
import { headerTitle } from "./fieldColumns/TitleColumn";
import { headerWeight } from "./fieldColumns/WeightColumn";
import { ITableSchema } from "./AccordionList";
import { headerCreated } from "./fieldColumns/CreatedColumn";
import { headerPeriod } from "./fieldColumns/PeriodColumn";
import { headerReview1, headerReview2, headerReviewOverall, headerSelf } from "./fieldColumns/ReviewColumn";
import { headerApprover } from "./fieldColumns/ApproversColumn";

export const groupByKRA = {
   headerProp: 'kraGroupByTitle', id: 'kraId',
   schema: {
      header: [
         headerTitle,
      ],
      content: [
         headerTitle,
         headerStatus,
         headerPriority,
         headerWeight,
         headerItemActions,
      ],
   }
};

export const groupByUser = {
   headerProp: 'user', id: 'userUPN',
   schema: {
      header: [
         headerUser,
         headerStatus,
         headerBlank,
         headerBlank,
         headerManager1,
         headerManager2,
         headerItemActions
      ],
      content: [
         headerTitle,
         headerStatus,
         headerPriority,
         headerWeight,
      ],
   }
};

export const groupByAppraisalUser = {
   headerProp: 'user', id: 'userUPN',
   schema: {
      header: [headerUser],
      content: [headerTitle],
   }
};

export const groupByYear = {
   headerProp: 'appraisalYear', id: 'appraisalYear',
   schema: {
      header: [
         {
            headerDisplayName: 'Year',
            maxWidth: '300px',
            fieldInternalName: 'appraisalYear',
        },
      ],
      content: [
         headerPeriod,
         headerStatus,
         headerSelf,
         headerReview1,
         headerReview2,
         headerCreated,
         headerItemActions,
      ],
   }
};

export const defaultGoalsHeader: ITableSchema[] = [
   headerUser,
   headerStatus,
   headerPriority,
   headerWeight,
   headerManager1,
   headerManager2,
   headerItemActions
];

export const myGoalsHeader: ITableSchema[] = [
   headerTitle,
   headerStatus,
   headerPriority,
   headerWeight,
   headerCreated,
   headerItemActions
];

export const defaultAppraisalsHeader: ITableSchema[] = [
   headerPeriod,
   headerStatus,
   headerSelf,
   headerReview1,
   headerReview2,
   headerCreated,
   headerItemActions
];

export const myAppraisalsHeader: ITableSchema[] = [
   headerPeriod,
   headerStatus,
   headerSelf,
   headerReview1,
   headerReview2,
   headerCreated,
   headerItemActions
];