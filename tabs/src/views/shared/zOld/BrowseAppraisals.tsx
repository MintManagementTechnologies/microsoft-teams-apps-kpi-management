import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, Header, Loader } from '@fluentui/react-northstar';

import { IAppraisalModel } from '../../../common/types/appraisal';
import Card, { ICardActions } from '../../../components/cards/Card';
import AccordionList, {
    IGroupByFields, ITableSchema
} from '../../../components/layouts/accordionList/AccordionList';
import { defaultAppraisalsHeader } from '../../../components/layouts/accordionList/schemas';

const BrowseAppraisals = (props: {
   items: IAppraisalModel[],
   isLoading: boolean,
   layout?: string,
   groupByFields?: IGroupByFields[],
   schema?: ITableSchema[]
} ): JSX.Element => {
   const { isLoading, items } = props;
   const { t } = useTranslation();

   const renderListSchema = (): ITableSchema[] => {
      return props.schema || defaultAppraisalsHeader;
   }
   
   //const groupByFields = props.groupByFields || [];

   return (
      <>{isLoading ? (
         <Loader label={t(`loading`)} style={{ margin: 100 }} />
      ) : (
         <>
            {items.length === 0 ? (
               <Flex fill hAlign="center" className='mmt-rowGutter'><Header as="h4" content={t('noGoals')} /></Flex>
            ) : 
               <AccordionList schema={renderListSchema()} groupByFields={props.groupByFields} items={items} hidePager />
               // <List schema={renderListSchema()} groupByFields={groupByFields} items={items} hidePager />
            }
         </>
      )}
      </>
   );
}

export default BrowseAppraisals;