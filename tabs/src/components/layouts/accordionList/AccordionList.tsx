import { Col, Row as BootstrapRow } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { gridNestedBehavior } from '@fluentui/accessibility';
import { Flex, Table, TableCell, TableRow } from '@fluentui/react-northstar';

import { IUserModel } from '../../../common/types/user';
import { IGoalModel } from '../../../features/goalsOld/types';
import Pagination from '../Pagination';
import { headerCreated } from './fieldColumns/CreatedColumn';
import { headerItemActions } from './fieldColumns/ItemActionsColumn';
import { headerStatus } from './fieldColumns/StatusColumn';
import { headerTitle } from './fieldColumns/TitleColumn';
import Header from './Header';
import RequestRow from './Row';
import SectionAccordionLayout from './SectionAccordionLayout';

export interface IRowSchema {
   maxWidth?: string;
   fieldInternalName: string;
   fieldType?: string;
}

export interface ITableSchema extends IRowSchema {
   headerDisplayName: string;
}

export interface IGroupByFields {
   id: string,
   headerProp: string,
   schema?: {
      header: IRowSchema[],
      content: IRowSchema[],
   }
}

const AccordionList = (props: { schema: ITableSchema[], groupByFields?: IGroupByFields[], items: any[], itemsPerPage?: number, hidePager?: boolean }): JSX.Element => {
   var { view, pageIndex } = useParams();
   const { schema, groupByFields, items, hidePager } = props;

   const currentPageIndex = pageIndex ? parseInt(pageIndex) : 1;
   const itemsPerPage = props.itemsPerPage || props.items.length;
   const indentHeaderLength = groupByFields ? groupByFields.length : 0;

   return (
      <>
         <BootstrapRow className="mmt-contentContainer mmt-list">
            <Col className='gx-0'>
               {groupByFields ?
                     <Table className='mmt-list-table'
                        compact
                        variables={{ cellContentOverflow: 'none' }}
                        aria-label='Nested navigation'
                        accessibility={gridNestedBehavior}
                     >
                        <Header headers={schema} className={`mmt-table-header-${0}`} />
                        <SectionAccordionLayout items={items} groupByFields={groupByFields!} key={`tmpMainAccordion`} />
                     </Table>
                  :
                  <>
                     <Table className='mmt-list-table'
                        compact
                        variables={{ cellContentOverflow: 'none' }}
                        aria-label='Nested navigation'
                        accessibility={gridNestedBehavior}
                     >
                        <Header headers={schema} className={`mmt-table-header-${indentHeaderLength}`} />
                        {props.items.slice((currentPageIndex - 1) * itemsPerPage, currentPageIndex * itemsPerPage).map(x =>
                           <RequestRow
                              key={`requestRow-${x.id}`}
                              schema={schema}
                              item={x}
                           />
                        )}
                     </Table>
                     <br />
                     {!hidePager &&
                        <Pagination totalPages={Math.ceil(props.items.length / itemsPerPage)} />
                     }
                  </>}
            </Col>
         </BootstrapRow>
      </>
   );
}

export default AccordionList;