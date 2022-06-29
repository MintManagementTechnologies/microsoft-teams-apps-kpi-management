import * as React from 'react';
import { useState } from 'react';
import { Flex, Text, Button, LikeIcon } from "@fluentui/react-northstar";
import { Row, Col, Container } from 'react-bootstrap';
import { useLocation } from "react-router-dom";

import "./DataTile.scss";
import DataTile, { IDataTile } from './DataTile';

const DataTilesGroup = (props: {
   loading: boolean,
   data: IDataTile[],
   filterable?: boolean,
}): JSX.Element => {
   const { loading, data, filterable } = props;

   const [selectedTile, setSelectedTile] = useState('');

   const onTileClick = (fieldInternalName: string, fieldFilterValue: string) => {
      if (selectedTile === fieldFilterValue) {
         setSelectedTile('');
      } else {
         setSelectedTile(fieldFilterValue);
      }
   }

   return (
      <Flex gap='gap.large' className='mmt-dataTilesGroup-container'>
         {data.map((tile, i) =>
            <DataTile key={`dataTile-${i + 1}`} data={tile} selected={tile.fieldFilterValue === selectedTile} enabled={filterable} onClickCallback={onTileClick} />
         )}
      </Flex>
   );
}

export default DataTilesGroup;