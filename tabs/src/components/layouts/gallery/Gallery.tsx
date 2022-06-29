import './Gallery.scss';

import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import Pagination from '../Pagination';

const Gallery = (props: { items: JSX.Element[], itemsPerPage?: number, hidePager?: boolean }): JSX.Element => {
   var { pageIndex } = useParams<{ pageIndex: string; }>();
   const currentPageIndex = parseInt(pageIndex || "1");
   const itemsPerPage = props.itemsPerPage || props.items.length;
   const hidePager = props.hidePager;
   return (
      <>
         <Row className="mmt-contentContainer mmt-gallery gy-4" xl={4} lg={3} md={2} sm={1} >
            {props.items.slice((currentPageIndex - 1) * itemsPerPage, currentPageIndex * itemsPerPage).map((x: any, i: number) =>
               <Col key={`col-galleryCard-${i}`} className={``}>
                  {x}
               </Col>
            )}
         </Row>
         {!hidePager &&
            <Pagination totalPages={Math.ceil(props.items.length / itemsPerPage)} />
         }
      </>
   );
}

export default Gallery;