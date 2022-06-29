import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, Header, Loader } from '@fluentui/react-northstar';

import Card, { ICardActions } from '../../../components/cards/Card';
import AccordionList, {
    IGroupByFields, ITableSchema
} from '../../../components/layouts/accordionList/AccordionList';
import { defaultGoalsHeader } from '../../../components/layouts/accordionList/schemas';
import Gallery from '../../../components/layouts/gallery/Gallery';
import { IGoalModel } from '../../../features/goalsOld/types';

const BrowseGoals = (props: {
   items: IGoalModel[],
   isLoading: boolean,
   layout?: string,
   groupByFields?: IGroupByFields[],
   schema?: ITableSchema[]
} ): JSX.Element => {
   const { isLoading, items } = props;
   const { t } = useTranslation();
   
   let [searchParams, setSearchParams] = useSearchParams();
   const layout = props.layout || searchParams.get("layout");

   const renderCardArray = () => {
      let UIitems: Array<JSX.Element> = [];
      if (items.length !== 0) {
         UIitems = items.map(x =>
            <Flex key={`flex-card-${x.id}`}>
               <Card
                  key={`card-${x.id}`}
                  item={x as (IGoalModel & ICardActions)}
                  type={'goal'}
               />
            </Flex>
         )
      }
      return UIitems as any[];
   }

   const renderListSchema = (): ITableSchema[] => {
      return props.schema || defaultGoalsHeader;
   }

   const groupByKRA = { headerProp: 'kraTitle', id: 'kraId' };
   const groupByFields = props.groupByFields || [groupByKRA];

   return (
      <>{isLoading ? (
         <Loader label={t(`loading`)} style={{ margin: 100 }} />
      ) : (
         <>
            {items.length === 0 ? (
               <Flex fill hAlign="center" className='mmt-rowGutter'><Header as="h4" content={t('noGoals')} /></Flex>
            ) : 
            (layout === 'cards' ?
               <Gallery items={renderCardArray()} />
               :
               <AccordionList schema={renderListSchema()} groupByFields={groupByFields} items={items} hidePager />
               // <List schema={renderListSchema()} groupByFields={groupByFields} items={items} hidePager />
            )}
         </>
      )}
      </>
   );
}

export default BrowseGoals;