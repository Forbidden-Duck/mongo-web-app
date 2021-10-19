import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

import ProfileComponent from "../../components/SettingsComponents/ProfileComponent";

import { clearError } from "../../store/auth/Auth.actions";
import { getUser } from "../../store/user/User.actions";

/**
 *
 * @param {{children: any, value: number, index: number}} props
 */
function TabContent(props) {
    const { children, value, index, ...rest } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...rest}>
            {value === index && children}
        </div>
    );
}

function Settings() {
    const classes = makeStyles((theme) => ({
        app: {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "calc(100% - 66px)",
        },
        content: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        },
    }))();

    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const {
        user,
        error: userError,
        isPending: userPending,
    } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(clearError());
        dispatch(getUser());
    }, [dispatch]);

    const [settingValue, setSettingValue] = useState(0);
    const handleSettingChange = (evt, newValue) => setSettingValue(newValue);

    return (
        <>
            <div className={classes.app}>
                <Box
                    sx={{
                        height: "100%",
                        width: "100px",
                        borderRight: "solid 1px gray",
                    }}
                >
                    <Tabs
                        orientation="vertical"
                        value={settingValue}
                        onChange={handleSettingChange}
                    >
                        <Tab label="Profile" />
                        <Tab label="Account" />
                        <Tab label="Security" />
                    </Tabs>
                </Box>
                <div className={classes.content}>
                    <TabContent value={settingValue} index={0}>
                        <ProfileComponent
                            isAuthenticated={isAuthenticated}
                            user={user}
                            userPending={userPending}
                            userError={userError}
                        />
                    </TabContent>
                    <TabContent value={settingValue} index={1}>
                        Tab 1
                    </TabContent>
                    <TabContent value={settingValue} index={2}>
                        Tab 2
                    </TabContent>
                </div>
            </div>
        </>
    );
}

export default Settings;
