import './StatusPills.scss';

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

const StatusPill = (props: IStatusPillProps): JSX.Element => {
    const { id, totalLevels, currentLevel, status, outcome } = props;
    //const keyId = id ? id : 
    const { t } = useTranslation();

    const pillClass = status === 'complete' ? outcome : status;

    const setLevelDisplayName = () => {
        let levelDisplayName = '';
        if (status === 'created' || status === 'pendingLvl') {
            levelDisplayName = '';
        }
        else if (totalLevels === currentLevel) {
            levelDisplayName = `${t('Final')}: `;
        } else {
            levelDisplayName = `${t('Level')} ${currentLevel}: `
        }
        return levelDisplayName;
    }

    return (
        // <Pill key={`pill-status-${id}}`} className={`mmt-statusPill ${pillClass}`}>
        <Pill className={`mmt-statusPill ${pillClass}`}>
            <Text content={t(`common:userRole.manager`) + ` ${currentLevel}: ` + t(`common:status.${pillClass}`)} />
        </Pill>
    );
}

export default StatusPill;