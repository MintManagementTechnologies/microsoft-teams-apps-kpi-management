import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { EditIcon } from '@fluentui/react-northstar';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { useAppDispatch } from '../../../../store';
import { selectAppraisal } from '../../appraisalSelectors';

const EditAppraisalBtn = (props: { id: string | number }): JSX.Element => {
   const { id } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedItemState = useSelector(selectAppraisal);

   const handleCallback = async (result: any) => {
      const _dialogResult = result as { action: string, additionalInfo: any };
      if (_dialogResult && _dialogResult.additionalInfo && _dialogResult.additionalInfo.includes("callback")) {
         // trigger(selectedWorkGrade);
      } else {
         console.log("DONT REFRESH");
      }
   }

   return (
      <TaskModuleButton
         title={`${t(`modal.myAppraisals.appraisal.headerAction`, { action: t(`common:button.edit`) })}`}
         path={`me/appraisal/edit/${id}`}
         content={`${t(`common:button.edit`)}`}
         icon={<EditIcon />}
         text
      // onClick={handleOnClick}
      />
   );
}

export default EditAppraisalBtn;