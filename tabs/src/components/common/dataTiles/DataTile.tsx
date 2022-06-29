import * as React from 'react';
import { Flex, Text, Button, LikeIcon } from "@fluentui/react-northstar";
import { Row, Col, Container } from 'react-bootstrap';
import { useLocation } from "react-router-dom";

import "./DataTile.scss";

export interface IDataTile {
   tileDisplayName: string;
   tileValue: string;
   fieldInternalName: string;
   fieldFilterValue?: string;
   color: string
}

const DataTile = (props: {
   data: IDataTile,
   selected?: boolean,
   enabled?: boolean,
   onClickCallback?: (fieldInternalName: string, fieldFilterValue: string) => void
}): JSX.Element => {
   const { data, selected, enabled, onClickCallback } = props;
   const enabledClassName = enabled ? "mmt-enabled" : "";
   const selectedClassName = selected ? "mmt-selected" : "";

   return (
      <Flex gap='gap.small' vAlign={'center'} hAlign={'center'} column className={`mmt-tile ${enabledClassName} mmt-${data.color}  ${selectedClassName}`}
         onClick={() => {
            if (enabled && onClickCallback)
               onClickCallback(data.fieldInternalName, data.fieldFilterValue || '')
         }}>
         <Text content={data.tileValue} size={'largest'} color={data.color} weight='bold' />
         <Text content={data.tileDisplayName} size={'small'} color={data.color} />
      </Flex>
   );
}

export default DataTile;