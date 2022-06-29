import { Flex } from '@fluentui/react-northstar';

const CardFooter = (props: { children?: JSX.Element }): JSX.Element => {
   return (
      <Flex hAlign="end" vAlign="center" fill gap="gap.small">
         {props.children}
      </Flex>
   );
}

export default CardFooter;