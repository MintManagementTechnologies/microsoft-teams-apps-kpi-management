
import './Card.scss';

import {
    Card as FluentCard, CardBody as FluentBody, CardFooter as FluentFooter,
    CardHeader as FluentHeader, Flex
} from '@fluentui/react-northstar';

import CardFooter from './CardFooter';
import CardHeader from './CardHeader';

const Card = (props: {
   item: { title: string, subtitle: string },
   header?: JSX.Element,
   body?: JSX.Element,
   footer?: JSX.Element
}): JSX.Element => {
   const { item } = props;
   return (
      <>
         <Flex fill space="around" column>
            <FluentCard className='mmt-card' ghost elevated>
               <FluentHeader className='mmt-header'>
                  <CardHeader title={item.title} subtitle={item.subtitle}>
                     {props.header}
                  </CardHeader>
               </FluentHeader>
               <FluentBody className='mmt-body' >
                  {props.body}
               </FluentBody>
               <FluentFooter className='mmt-footer'>
                  <CardFooter>
                     {props.footer}
                  </CardFooter>
               </FluentFooter>
            </FluentCard>
         </Flex>
      </>
   );
}

export default Card;
