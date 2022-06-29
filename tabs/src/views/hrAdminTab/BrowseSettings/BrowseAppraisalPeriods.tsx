import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import AppraisalPeriodList from '../../../features/appraisalPeriods/AppraisalPeriodList';
import {
    selectAppraisalPeriodList
} from '../../../features/appraisalPeriods/appraisalPeriodSelectors';
import NewAppraisalPeriodBtn from '../../../features/appraisalPeriods/parts/buttons/NewAppraisalPeriodBtn';

const BrowseAppraisalPeriods = (): JSX.Element => {
   const { t } = useTranslation();

   const items = useSelector(selectAppraisalPeriodList);

   return (
      <>
         <NewAppraisalPeriodBtn />
         <AppraisalPeriodList isRootList/>
      </>
   );
}

export default BrowseAppraisalPeriods;