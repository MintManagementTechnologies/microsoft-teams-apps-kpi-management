import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Loader, LoaderProps } from '@fluentui/react-northstar';

const LoaderHOC = (props: { message?: string, hAlign?: "center" | "end" | "start" | "stretch" } & LoaderProps): JSX.Element => {
   const { t } = useTranslation();
   const { message, hAlign, ...otherProps } = props;
   const entity = message || '';
   return (
      <Flex hAlign={hAlign || 'center'} fill>
         <Loader label={t('common:loading', {entity: entity})} {...otherProps} />
      </Flex>
   );
}

export default LoaderHOC;