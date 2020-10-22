import React, {useState} from "react";
import {
  AppBar,
    Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";

import {
  NotificationsNone as NotificationsIcon,
} from "@material-ui/icons";

// styles
import useStyles from "./styles";

// components
import { Badge, Typography } from "../Wrappers";
import Notification from "../Notification/Notification";
import AuthService from "../../services/auth.service";

import * as Icons from "@material-ui/icons";



// const notifications = [
//   { id: 0, color: "warning", message: "Check out this awesome ticket" },
//   {
//     id: 1,
//     color: "success",
//     type: "info",
//     message: "What is the best way to get ...",
//   },
// ];

export default function Header({setContent}) {
    // const [currentUser, setCurrentUser] = useState(false);
    //
    // useEffect(() => {
    //     const user = AuthService.getCurrentUser();
    //
    //     if (user) {
    //         setCurrentUser(user);
    //         // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
    //         // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    //     }
    // }, []);

    const [notifications, setNotifications] = useState([]);
    // useEffect(() => {
    //     // code to run on component mount
    //     DataService.getNotifications(1).then(
    //         (response) => {
    //             console.log(response.data);
    //             // rename the response.data from the API to show in the notifications
    //             var nameMap = {
    //                 id:'id',
    //                 email:'message'
    //             };
    //             var renamed = [Object.keys(response.data).reduce(
    //                 (acc, key) => {
    //                     acc[nameMap[key]] = response.data[key];
    //                     return acc;
    //                 }, {})];
    //
    //             // console.log(renamed);
    //             setNotifications(renamed)
    //         },
    //         (error) => {
    //             const _content =
    //                 (error.response &&
    //                     error.response.data &&
    //                     error.response.data.message) ||
    //                 error.message ||
    //                 error.toString();
    //             console.log(error)
    //         }
    //     );
    // }, []);


    const logOut = () => {
       AuthService.logout();
    };

  var classes = useStyles();

  // local
  var [notificationsMenu, setNotificationsMenu] = useState(null);
  var [isNotificationsUnread, setIsNotificationsUnread] = useState(true);

  return (
    <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          Dashboard
        </Typography>

            <IconButton
                color="inherit"
                aria-haspopup="true"
                aria-controls="mail-menu"
                onClick={e => {
                    console.log(e.currentTarget)

                    setContent("current");
                    // setNotificationsMenu(e.currentTarget);
                }}
                className={classes.headerMenuButton}
            >
                <Icons.QueryBuilder/>
                <Typography variant="h6" weight="medium" className={classes.logotype}>
                    Occupation
                </Typography>

            </IconButton>

            <IconButton
                color="inherit"
                aria-haspopup="true"
                aria-controls="mail-menu"
                onClick={e => {
                    // setNotificationsMenu(e.currentTarget);
                    setContent("historical");
                }}
                className={classes.headerMenuButton}
            >
                <Icons.Timeline/>
                <Typography variant="h6" weight="medium" className={classes.logotype}>
                    Historical
                </Typography>

            </IconButton>

        <div className={classes.grow} />

        <IconButton
          color="inherit"
          aria-haspopup="true"
          aria-controls="mail-menu"
          onClick={e => {
            setNotificationsMenu(e.currentTarget);
            setIsNotificationsUnread(false);
          }}
          className={classes.headerMenuButton}
        >
          <Badge
            badgeContent={isNotificationsUnread ? notifications.length : null}
            color="warning"
          >
            <NotificationsIcon classes={{ root: classes.headerIcon }} />
          </Badge>
        </IconButton>
        <Menu
          id="notifications-menu"
          open={Boolean(notificationsMenu)}
          anchorEl={notificationsMenu}
          onClose={() => setNotificationsMenu(null)}
          className={classes.headerMenu}
          disableAutoFocusItem
        >
          {notifications.map(notification => (
            <MenuItem
              key={notification.id}
              onClick={() => setNotificationsMenu(null)}
              className={classes.headerMenuItem}
            >
              <Notification {...notification} typographyVariant="inherit" />
            </MenuItem>
          ))}
        </Menu>
        </Toolbar>
    </AppBar>
  );
}
