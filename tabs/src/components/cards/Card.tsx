
import './Card.scss';

import { useLocation } from 'react-router-dom';

import {
    Card as FluentCard, CardBody as FluentBody, CardFooter as FluentFooter,
    CardHeader as FluentHeader, Flex
} from '@fluentui/react-northstar';

import { ICompetencyModel } from '../../common/types/competency';
import { IGoalModel } from '../../features/goalsOld/types';
import { IKeyResultAreaModel } from '../../features/keyResultAreas/types';
import { getSingleCommand, ICommand } from '../commands/commands';
import { actionManager } from '../commands/uiActions';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';
import GoalCardBody from './goalCard/GoalCardBody';

export interface ICardActions {
   _actions: string[],
   _footerActions: string[],
}

const Card = (props: {
   type: string, // goal | competency | kra
   item: (IGoalModel | ICompetencyModel) & ICardActions,
}): JSX.Element => {
   const { pathname } = useLocation();
   const { type, item } = props;
   const cardBody = () => {
      switch (type) {
         case 'goal':
            return <GoalCardBody item={item as IGoalModel} />
         default:
            return <GoalCardBody item={item as IGoalModel} />
      }
   }

   const headerActions = actionManager(pathname).getActions(item._actions);
   const headerCommands = headerActions.map(action => action.getCommand());

   const footerActions = actionManager(pathname).getActions(item._footerActions);
   const footerCommands = footerActions.map(action => action.getCommand());

   return (
      <>
         <Flex fill space="around" column>
            <FluentCard className='mmt-card' ghost elevated>
               <FluentHeader className='mmt-header'>
                  <CardHeader title={item.title} subtitle={(item as IGoalModel).kraTitle} itemdId={item.id} commands={headerCommands}/>
               </FluentHeader>
               <FluentBody className='mmt-body' >
                  {cardBody()}
               </FluentBody>
               <FluentFooter className='mmt-footer'>
                  <CardFooter itemId={item.id} commands={footerCommands} />
               </FluentFooter>
            </FluentCard>
         </Flex>
      </>
   );
}

export default Card;
