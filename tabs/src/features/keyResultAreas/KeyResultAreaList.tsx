import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Flex, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';
import KeyResultArea from './KeyResultArea';
import { useLazyGetAllKeyResultAreasQuery } from './keyResultAreaService';
import { listChanged, selectKeyResultAreaFormState } from './keyResultAreaSlice';
import { IKeyResultAreaModel, newKeyResultArea } from './types';

const KeyResultAreaList = (props: { items?: IKeyResultAreaModel[] }): JSX.Element => {
   const { items } = props;
   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedFormState = useTypedSelector((state: RootState) => state.keyResultArea.formState);

   const [triggerGetAllKeyResultAreas,
      { data: dataGetAllKeyResultAreas, isFetching: isFetchingGetAllKeyResultAreas, isLoading: isLoadingGetAllKeyResultAreas }]
      = useLazyGetAllKeyResultAreasQuery();

   // Init Item
   useEffect(() => {
      if (items?.length === 0) {
         triggerGetAllKeyResultAreas();
         // dispatch(listChanged(items));
      }
   }, []);

   // Init Item
   useEffect(() => {
      if (!dataGetAllKeyResultAreas) return
      dispatch(listChanged(dataGetAllKeyResultAreas));
   }, [dataGetAllKeyResultAreas]);

   const allItems = items || dataGetAllKeyResultAreas;

   const showNewItemForm = selectedFormState === 'new';
   const isLoading = isLoadingGetAllKeyResultAreas || isFetchingGetAllKeyResultAreas;
   const hasItems = allItems && allItems.length > 0;

   const isError = !(hasItems || isLoading);
   if (isError) {
      return (<ErrorMessage message={t('common:error.noItemsOfEntity', { entity: t('entity.kra', { count: 0 }).toLocaleLowerCase() })}/>)
   }

   return (
      <Flex fill gap="gap.small" column>
         {showNewItemForm && <KeyResultArea item={newKeyResultArea} displayMode={'new'} key={`key-kra-000`} />}
         {isLoading && <Loader message={t('entity.kra', { count: 0 })} />}
         {hasItems && allItems.map(item =>
            <KeyResultArea item={item} key={`key-kra-${item.id}`} />
         )}
      </Flex>
   );
}

export default KeyResultAreaList;