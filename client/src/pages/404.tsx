import * as React from 'react';
import { Link } from "react-router-dom";
import {
    NotFound
} from 'amis'
import { useTranslation } from "react-i18next";

export default () => {
    const { t } = useTranslation();
    return (
        <NotFound
            links={(
                <Link to="/" className="list-group-item">
                    <i className="fa fa-chevron-right text-muted" />
                    <i className="fa fa-fw fa-mail-forward m-r-xs" />
                    {t("nav.goHome")}
                </Link>
            )}
            footerText={""}
        />
    );
};