import { Flex, FlexItem, Text } from '@fluentui/react-northstar';

const CardHeader = (props: { title?: string, subtitle?: string, children?: JSX.Element }): JSX.Element => {
   const { title, subtitle } = props;

   return (
      <Flex fill>
         <FlexItem >
            <Flex column fill className="mmt-cardHeader-title">
               <Text content={title} weight="bold" className="mmt-title" color='brand' truncated />
               <Text
                  content={`${subtitle}`}
                  size="small"
                  timestamp
                  className="mmt-subtitle"
               />
            </Flex>
         </FlexItem>
         <FlexItem push>
            {props.children}
         </FlexItem>
         {/* <Flex hAlign="end" gap="gap.small">
            {props.children}
         </Flex> */}
      </Flex>
   );
};

export default CardHeader;
