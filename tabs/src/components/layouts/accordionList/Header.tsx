import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TableRow, Flex, Text } from '@fluentui/react-northstar';
import { ITableSchema } from './AccordionList';

export interface IHeader extends ITableSchema {
   paddingLeft?: string;
}

const Header = (props: { headers: IHeader[], className?: string }): JSX.Element => {
   const additionalClasses = props.className || '';
   const headerColumns = props.headers.map((x: IHeader, index) => ({
      content:
         <Flex fill vAlign='center'>
            <Text content={x.headerDisplayName} />
            {/* <Text content={t(x.headerDisplayName)} /> */}
         </Flex>,
      key: 'header-' + x.fieldInternalName + '-' + index,
      styles: {
         maxWidth: x.maxWidth,
         width: '100%',
         paddingLeft: x.paddingLeft ? x.paddingLeft : '0.5rem',
      },
      className: `mmt-${x.fieldInternalName}-header`
   }));

   return (<TableRow className={`mmt-table-header ${additionalClasses}`} header key='table-header' compact items={headerColumns} />);
}

export default Header;