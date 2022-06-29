import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import KeyResultAreaList from '../../../features/keyResultAreas/KeyResultAreaList';
import { selectKeyResultAreaList } from '../../../features/keyResultAreas/keyResultAreaSlice';
import NewKeyResultAreaBtn from '../../../features/keyResultAreas/parts/buttons/NewKeyResultAreaBtn';

const BrowseKeyResultAreas = (): JSX.Element => {
   const { t } = useTranslation();

   const items = useSelector(selectKeyResultAreaList);

   return (
      <>
         <NewKeyResultAreaBtn />
         <KeyResultAreaList items={items} />
      </>
   );
}

export default BrowseKeyResultAreas;