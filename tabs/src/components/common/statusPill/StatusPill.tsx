import './StatusPill.scss';

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Pill, Text } from '@fluentui/react-northstar';

interface IStatusPillProps {
    id?: string;
    totalLevels: number;
    currentLevel: number;
    status: string;
    outcome: string;
}

const StatusPill = (props: {status: string, content?: string}): JSX.Element => {
    const { status, content } = props;
    const { t } = useTranslation();

    const prefixContent = content ? `${content} ` : '';
    const pillClass = `mmt-${status}`;
    return (
        // <Pill key={`pill-status-${id}}`} className={`mmt-statusPill ${pillClass}`}>
        <Pill className={`mmt-statusPill ${pillClass}`}>
            <Text content={`${prefixContent}${t(`common:status.${status}`)}`} />
        </Pill>
    );
}

export default StatusPill;