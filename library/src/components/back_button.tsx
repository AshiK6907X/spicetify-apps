import React from "react";
import { useNavigation } from "./nav_context";

function BackIcon(): React.ReactElement<SVGElement> {
	return (
		<Spicetify.ReactComponent.IconComponent
			semanticColor="textSubdued"
			dangerouslySetInnerHTML={{
				__html:
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.957 2.793a1 1 0 0 1 0 1.414L8.164 12l7.793 7.793a1 1 0 1 1-1.414 1.414L5.336 12l9.207-9.207a1 1 0 0 1 1.414 0z"></path></svg>',
			}}
			iconSize={16}
		/>
	);
}

function BackButton(): React.ReactElement<HTMLButtonElement> {
	const { ReactComponent } = Spicetify;
	const { TooltipWrapper, ButtonTertiary } = ReactComponent;
    const { goBack } = useNavigation();

	return (
		<TooltipWrapper label={"Back"} placement="top">
			<span>
                <ButtonTertiary buttonSize="sm" aria-label="Back" iconOnly={BackIcon} onClick={() => { goBack() }}/>
			</span>
		</TooltipWrapper>
	);
}

export default BackButton;

