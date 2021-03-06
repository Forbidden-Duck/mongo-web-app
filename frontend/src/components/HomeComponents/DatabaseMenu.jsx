import React from "react";
import { useDispatch } from "react-redux";
import { Typography, IconButton, MenuItem, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faSave,
    faStar,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";

import useActionMenu from "../../hooks/useActionMenu/useActionMenu";

import {
    createOne,
    deleteOne,
    updateOne,
    toggleFavourite,
} from "../../store/db/Db.actions";

/**
 * @typedef {object} DatabaseMenuProps
 * @property {object} database
 * @property {boolean} isAuthenticated
 * @property {boolean} handleDelete
 */

/**
 *
 * @param {import("@mui/material").MenuProps & DatabaseMenuProps} props
 */
function DatabaseMenu(props) {
    const [, , closeMenu, menuToggle, Menu] = useActionMenu();
    const dispatch = useDispatch();

    const middlewareClick = (func) => {
        if (props.isAuthenticated) {
            closeMenu();
            return func();
        }
    };
    const handleSave = () => {
        middlewareClick(() => {
            if (props.database.saved) {
                dispatch(deleteOne({ id: props.database._id }));
            } else {
                dispatch(
                    createOne({
                        db: {
                            address: props.database.address,
                            host: props.database.host,
                            username: props.database.username,
                            password: props.database.password,
                            favourite: !!props.database.favourite,
                        },
                    })
                );
                props.handleDelete();
            }
        });
    };
    const handleFavourite = () => {
        middlewareClick(() => {
            if (props.database.saved) {
                dispatch(
                    updateOne({
                        id: props.database._id,
                        db: { favourite: !props.database?.favourite },
                    })
                );
            } else {
                dispatch(toggleFavourite(props.database._id));
            }
        });
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
                            &nbsp;{props.database.saved ? "Unsave" : "Save"}
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
                            &nbsp;
                            {props.database?.favourite
                                ? "Unfavourite"
                                : "Favourite"}
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
