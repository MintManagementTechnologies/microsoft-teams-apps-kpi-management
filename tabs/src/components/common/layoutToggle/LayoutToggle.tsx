import * as React from 'react';
import {
   Button, Flex, GridIcon, NumberListIcon
} from "@fluentui/react-northstar";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const LayoutToggle = (): JSX.Element => {
   const { t } = useTranslation();
   let [searchParams, setSearchParams] = useSearchParams();
   let layout = searchParams.get("layout");

   const onLayoutToggleClick = (_layout: string) => {
      setSearchParams(
         createSearchParams({
            layout: [_layout]
         })
      );
   }

   return (
      <Flex gap='gap.small' hAlign='end'>
         <Button iconOnly icon={<GridIcon />} title={t('cards')} primary={layout === 'cards'} key={`layout-gallery`} onClick={() => onLayoutToggleClick('cards')} />
         <Button iconOnly icon={<NumberListIcon />} title={t('list')} primary={layout === 'list'} key={`layout-list`} onClick={() => onLayoutToggleClick('list')} />
      </Flex>
   );
}

export default LayoutToggle;