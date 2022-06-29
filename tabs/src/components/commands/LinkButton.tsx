import { Button, ButtonProps } from "@fluentui/react-northstar";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ICommand } from "./commands";

const LinkButton = (props: {
	itemId: string;
	command: ICommand;
} & ButtonProps): JSX.Element => {
   const { userScope } = useParams();
   const { t, i18n } = useTranslation();
	const { command, itemId, ...btnProps } = props;

   let [searchParams, setSearchParams] = useSearchParams();
   const layout = searchParams.get("layout");

	return (
		<Button
         as={Link}
         {...btnProps}
			className={`mmt-${command.type}-btn mmt-${command.internalName}-btn ui-button`}
			content={t(`${command.displayName}`)}
         to={{ pathname: `/${userScope}/${command.value.path}/${itemId}?layout=${layout}` }}
		/>
	);
};

export default LinkButton;
