import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Button, Flex } from '@fluentui/react-northstar';

const Pagination = (props: {
    totalPages: number;
}): JSX.Element => {
    const { t, i18n } = useTranslation();
    var { pageIndex } = useParams<{ pageIndex: string; }>();

    const currentPageIndex = parseInt(pageIndex!);
    const prevPageIndex = currentPageIndex - 1;
    const nextPageIndex = currentPageIndex + 1;

    const route = useLocation().pathname.replace("/" + pageIndex, "");

    const createPageNumbers = () => {
        let pageBtnArray = [];
        var i = 1;
        while (i <= props.totalPages) {
            pageBtnArray.push(<Button className="mmt-pagination-btn-number mmt-link-btn" primary={currentPageIndex === i} as={Link} content={i} to={`${route}/${i}`}
                key={`pagination-${i}`} />);
            i++;
        }
        return pageBtnArray;
    }

    return (
        <div className="d-flex mmt-gallery-pager mmt-rowGutter mmt-rowGutter-bottom">
            <Flex hAlign="center" fill>
                <Button disabled={prevPageIndex === 0} as={Link} content={t('Previous')} to={`${route}/${prevPageIndex}`}
                    key={`pagination-prev`} text />
                {createPageNumbers()}
                <Button disabled={currentPageIndex === props.totalPages} as={Link} content={t('Next')} to={`${route}/${nextPageIndex}`}
                    key={`pagination-next`} text />
            </Flex>
        </div>
    );
}

export default Pagination;
