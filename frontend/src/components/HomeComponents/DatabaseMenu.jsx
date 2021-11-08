import React from "react";
import { Typography, IconButton, MenuItem, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faSave,
    faStar,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";

import useActionMenu from "../../hooks/useActionMenu/useActionMenu";

/**
 * @typedef {object} DatabaseMenuProps
 * @property {boolean} isAuthenticated
 * @property {boolean} handleDelete
 */

/**
 *
 * @param {import("@mui/material").MenuProps & DatabaseMenuProps} props
 */
function DatabaseMenu(props) {
    const [, , closeMenu, menuToggle, Menu] = useActionMenu();

    const middlewareClick = (func) => {
        if (props.isAuthenticated) {
            closeMenu();
            return func();
        }
    };
    const handleSave = () => {
        middlewareClick(() => {
            console.log("save clicked");
        });
    };
    const handleFavourite = () => {
        middlewareClick(() => console.log("favourite clicked"));
    };

    const menuProps = { ...props };
    delete menuProps.isAuthenticated;
    delete menuProps.handleDelete;
    return (
        <>
            <IconButton size="small" onClick={menuToggle}>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
            </IconButton>
            <Menu {...menuProps}>
                <Tooltip
                    title={!props.isAuthenticated ? "Not logged in" : ""}
                    placement="right"
                >
                    <MenuItem
                        onClick={handleSave}
                        disabled={!props.isAuthenticated}
                        sx={{
                            "&.Mui-disabled": {
                                pointerEvents: "auto",
                            },
                        }}
                    >
                        <Typography>
                            <FontAwesomeIcon icon={faSave} />
                            &nbsp;Save
                        </Typography>
                    </MenuItem>
                </Tooltip>
                <Tooltip
                    title={!props.isAuthenticated ? "Not logged in" : ""}
                    placement="right"
                >
                    <MenuItem
                        onClick={handleFavourite}
                        disabled={!props.isAuthenticated}
                        sx={{
                            "&.Mui-disabled": {
                                pointerEvents: "auto",
                            },
                        }}
                    >
                        <Typography>
                            <FontAwesomeIcon icon={faStar} />
                            &nbsp;Favourite
                        </Typography>
                    </MenuItem>
                </Tooltip>
                <MenuItem onClick={props.handleDelete}>
                    <Typography style={{ color: "red" }}>
                        <FontAwesomeIcon icon={faTrash} />
                        &nbsp;Delete
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
}

export default DatabaseMenu;
