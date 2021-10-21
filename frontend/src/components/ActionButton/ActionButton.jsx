import React from "react";
import { Button, CircularProgress } from "@mui/material";

/**
 *
 * @param {import("@mui/material").ButtonProps & {isLoading: boolean, progressVariant: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"}} props
 */
function ActionButton(props) {
    const { children, progressVariant, isLoading, ...rest } = props;
    rest.disabled = !!isLoading || !!rest.disabled;
    return (
        <Button {...rest}>
            {isLoading ? (
                <CircularProgress
                    color={!!progressVariant ? progressVariant : "primary"}
                />
            ) : (
                children
            )}
        </Button>
    );
}

export default ActionButton;
