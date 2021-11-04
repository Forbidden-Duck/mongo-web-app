import React, { useState } from "react";
import { Typography, Menu } from "@mui/material";

/**
 *
 * @returns {[menuState: boolean, openMenu: function, closeMenu: function, toggleMenu: function, ActionMenu: (props: import("@mui/material").MenuProps) => JSX.Element]}
 */
function useActionMenu() {
    const [menu, setMenu] = useState(null);
    const openMenu = (evt) => setMenu(evt.currentTarget);
    const closeMenu = () => setMenu(null);
    const toggleMenu = (evt) => setMenu(!!menu ? null : evt.currentTarget);
    return [
        !!menu,
        openMenu,
        closeMenu,
        toggleMenu,
        function (props) {
            return (
                <Menu
                    {...props}
                    anchorEl={menu}
                    open={!!menu}
                    onClose={closeMenu}
                />
            );
        },
    ];
}

export default useActionMenu;
