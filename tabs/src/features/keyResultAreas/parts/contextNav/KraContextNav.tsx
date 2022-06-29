import './KraContextNav.scss';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { AcceptIcon, Flex, Menu, tabListBehavior, Text } from '@fluentui/react-northstar';

import { log } from '../../../../common/utils/customConsoleLog';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { itemIdChanged } from '../../keyResultAreaSlice';

const KeyResultAreaContextNav = (props: { items: { id: number | string, title: string }[] }): JSX.Element => {
   const { items } = props;
   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();
   let defaultActiveKeyResultAreaId = useTypedSelector((state: RootState) => state.keyResultArea.itemId);

   useEffect(() => {
      if(items.length === 0) return;
      if (defaultActiveKeyResultAreaId) {
         log(`There is already a default active ${defaultActiveKeyResultAreaId}`);
      } else {
         dispatch(itemIdChanged(items[0].id));
      }
   }, [items]);

   const handleOnItemClick = (event: any, item: any) => {
      dispatch(itemIdChanged(items[item.index].id));
   }

   const kraItems = items.map((x, i) => ({
      className: x.id === defaultActiveKeyResultAreaId ? 'mmt-selected' : '',
      key: x.id,
      content: x.title,
      // icon: <AcceptIcon />
   }));

   return (
      <Flex className={`mmt-kraContextNav mmt-contextNav-container`} fill column>
         <Text content={`${t(`entity.kra`, { count: 0 })}`} weight={'bold'} color="brand" size="large" className="mmt-kraContextNav-title" />
         <Menu defaultActiveIndex={0} accessibility={tabListBehavior}
            items={kraItems}
            vertical
            fluid
            onItemClick={(event, item) => { handleOnItemClick(event, item) }}
         />
      </Flex>
   );
}

export default KeyResultAreaContextNav;
