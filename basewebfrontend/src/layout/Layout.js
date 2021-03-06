import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import clsx from "clsx";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getMenu, logout } from "../action";
import Logo from "../component/common/Logo";
import { LayoutBreadcrumbs } from "./LayoutBreadcrumbs";
import AccountButton from "./account/AccountButton";
import SideBar from "./SideBar";
import { FcVip } from "react-icons/fc";
import { Link, Button } from "@material-ui/core";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarTitle: {
    marginLeft: theme.spacing(2),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  hideButton: {
    // marginLeft: drawerWidth / 2 - theme.spacing(6),
    marginLeft: 90,
  },
  toolbarButtons: {
    marginLeft: "auto",
    marginRight: -12,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth + theme.spacing(10) + 1,
  },
  contentShiftOpen: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  contentShiftClose: {
    marginLeft: 0,
  },
}));

function Layout(props) {
  const { children } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [openCollapseMenuItem, setOpenCollapseMenuItem] = React.useState(
    new Set()
  );

  const handleDrawer = () => {
    setOpen(!open);
    if (open) setOpenCollapseMenuItem(new Set());
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleLogout = (e) => {
    props.processLogout();
  };

  useEffect(() => {
    if (props.isMenuGot === false) props.getMenu();
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          // [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Link href="/">
            <img
              src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/logo/Sapo-logo.svg?v=202008221004"
              width={100}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
          </Link>

          {open ? (
            <Typography variant="h6" noWrap>
              
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawer}
                edge="start"
                className={classes.hideButton}
              >
                <MenuOpenIcon />
              </IconButton>
            </Typography>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawer}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}
          <div
            className={clsx({
              [classes.appBarTitle]: open,
            })}
          >
            <Typography variant="h6" noWrap>
              Quản lý kho
            </Typography>
          </div>
          <span className={classes.toolbarButtons}>
            <AccountButton handleLogout={handleLogout} />
          </span>
        </Toolbar>
      </AppBar>
      <SideBar
        open={open}
        setOpen={setOpen}
        handleDrawerClose={handleDrawerClose}
        openCollapse={openCollapseMenuItem}
        setOpenCollapse={setOpenCollapseMenuItem}
        menu={props.menu}
      />
      <main
        className={clsx(classes.content, {
          [classes.contentShiftOpen]: open,
          [classes.contentShiftClose]: !open,
        })}
      >
        <div className={classes.toolbar} />
        <LayoutBreadcrumbs />
        {children}
      </main>
    </div>
  );
}

const mapStateToProps = (state) => ({
  menu: state.menu.menu,
  isMenuGot: state.menu.isMenuGot,
});

const mapDispatchToProps = (dispatch) => ({
  getMenu: () => dispatch(getMenu()),
  processLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
