import React, { useState, useEffect, createContext, useContext } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleIcon from "@material-ui/icons/People";
import CssBaseline from "@material-ui/core/CssBaseline";
import Collapse from "@material-ui/core/Collapse";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import HomeIcon from "@material-ui/icons/Home";
import ContactsIcon from "@material-ui/icons/Contacts";
import WebAssetIcon from "@material-ui/icons/WebAsset";
import LanguageIcon from "@material-ui/icons/Language";
import GitHubIcon from "@material-ui/icons/GitHub";
import LoopIcon from "@material-ui/icons/Loop";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import SettingsIcon from "@material-ui/icons/Settings";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import MessageIcon from "@material-ui/icons/Message";
import AndroidIcon from "@material-ui/icons/Android";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import StorefrontIcon from "@material-ui/icons/Storefront";
import PersonIcon from "@material-ui/icons/Person";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import GroupDialog from "./GroupDialog";
import { Link } from "react-router-dom";
import { NotificationsActive } from "@material-ui/icons";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import PetsIcon from "@material-ui/icons/Pets";
import SportsHandballIcon from "@material-ui/icons/SportsHandball";
import useAxios from "axios-hooks";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nestList: {
    "& > .MuiListItem-root": {
      paddingLeft: theme.spacing(4),
    },
  },
  toolbar: theme.mixins.toolbar,
}));

const BarContext = createContext({
  groupDialogOpen: false,
  setGroupDialogOpen: () => {},
});

const drawerWidth = 240;

const NavBar = props => {
  const [{ data = {} }, getMe] = useAxios(`/api/me`, { manual: true });
  const { children } = props;
  const classes = useStyles();
  const [isLoggedIn, setLoggedIn] = useState(window.liff.isLoggedIn());
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [oftenBoxOpen, setOftenBoxOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      getMe();
    }
  }, [isLoggedIn]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeDrawer = () => setMobileOpen(false);
  const { privilege } = data;

  const drawer = (
    <div>
      <List subheader={<ListSubheader component="div">布丁機器人</ListSubheader>}>
        <ListItem button component={Link} to="/" onClick={closeDrawer}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"首頁"} />
        </ListItem>
        <ListItem button component={Link} to="/Rankings" onClick={closeDrawer}>
          <ListItemIcon>
            <EqualizerIcon />
          </ListItemIcon>
          <ListItemText primary={"排行榜"} />
        </ListItem>
        <PrincessDrawer />
        <BotDrawer />
        {isLoggedIn && <PersonalDrawer />}
        <ListItem button onClick={() => setOftenBoxOpen(!oftenBoxOpen)}>
          <ListItemIcon>
            <WebAssetIcon />
          </ListItemIcon>
          <ListItemText primary="相關連結" />
          {oftenBoxOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={oftenBoxOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.nestList}>
            <ListItem
              button
              component="a"
              href="https://forum.gamer.com.tw/C.php?bsn=30861&snA=32345&tnum=11"
            >
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="布丁巴哈更新串" />
            </ListItem>
            <ListItem button component="a" href="https://discord.gg/Fy82rTb">
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="布丁Discord" />
            </ListItem>
            <ListItem
              button
              component="a"
              href="https://www.facebook.com/LINE-%E5%B8%83%E4%B8%81%E6%A9%9F%E5%99%A8%E4%BA%BA-585322668658383"
            >
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="布丁FB粉絲團" />
            </ListItem>
          </List>
        </Collapse>
        {privilege && <AdminDrawer />}
        <ListItem button component="a" href="https://github.com/hanshino/redive_linebot">
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText primary={"Github原始碼"} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <BarContext.Provider
      value={{
        groupDialogOpen,
        setGroupDialogOpen,
      }}
    >
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {"布丁 - 公主連結 LineBot"}
            </Typography>
            {!isLoggedIn ? (
              <Button color="inherit" onClick={doLogin}>
                登入
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={() => {
                  doLogout();
                  setLoggedIn(false);
                }}
              >
                登出
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
        {isLoggedIn ? (
          <GroupDialog open={groupDialogOpen} onClose={() => setGroupDialogOpen(false)} />
        ) : null}
      </div>
    </BarContext.Provider>
  );
};

NavBar.propTypes = {
  children: PropTypes.node.isRequired,
};

const AdminDrawer = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="管理員" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className={classes.nestList}>
          <ListItem button component={Link} to="/Admin/GachaPool">
            <ListItemIcon>
              <SportsEsportsIcon />
            </ListItemIcon>
            <ListItemText primary="轉蛋管理" />
          </ListItem>
          <ListItem button component={Link} to="/Admin/GachaShop">
            <ListItemIcon>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText primary="女神石商店" />
          </ListItem>
          <ListItem button component={Link} to="/Admin/GlobalOrder">
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary="全群指令管理" />
          </ListItem>
          <ListItem button component={Link} to="/Admin/Messages">
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary="訊息實況" />
          </ListItem>
          <ListItem button component={Link} to="/Admin/Worldboss">
            <ListItemIcon>
              <PetsIcon />
            </ListItemIcon>
            <ListItemText primary="世界王設定" />
          </ListItem>
          <ListItem button component={Link} to="/Admin/WorldbossEvent">
            <ListItemIcon>
              <SportsHandballIcon />
            </ListItemIcon>
            <ListItemText primary="世界王活動設定" />
          </ListItem>
          <ListItem button component={Link} to="/Admin/WorldbossMessage">
            <ListItemIcon>
              <FitnessCenterIcon />
            </ListItemIcon>
            <ListItemText primary="世界王特色訊息" />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};

/**
 * 個人用的 NavBar Drawer
 */
const PersonalDrawer = () => {
  const [open, setOpen] = useState(false);
  const { setGroupDialogOpen } = useContext(BarContext);
  const classes = useStyles();

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="個人功能" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className={classes.nestList}>
          <ListItem button onClick={() => setGroupDialogOpen(true)}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={"群組列表"} />
          </ListItem>
          <ListItem button component={Link} to="/Trade/Manage">
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText primary={"交易管理"} />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};

const PrincessDrawer = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemIcon>
          <WorkOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="公主連結功能" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className={classes.nestList}>
          <ListItem button component={Link} to="/Princess/Profile">
            <ListItemIcon>
              <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary={"公主好友小卡"} />
          </ListItem>
          <ListItem button component={Link} to="/Tools/BattleTime">
            <ListItemIcon>
              <LoopIcon />
            </ListItemIcon>
            <ListItemText primary={"補償刀軸換算"} />
          </ListItem>
          <ListItem button component={Link} to="/Gacha/Exchange">
            <ListItemIcon>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText primary="轉蛋商店" />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};

const BotDrawer = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemIcon>
          <AndroidIcon />
        </ListItemIcon>
        <ListItemText primary="機器人功能" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className={classes.nestList}>
          <ListItem button component={Link} to="/Panel/Manual">
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="使用手冊" />
          </ListItem>
          <ListItem button component={Link} to="/Bot/Notify">
            <ListItemIcon>
              <NotificationsActive />
            </ListItemIcon>
            <ListItemText primary={"訂閱通知"} />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};

const { liff, location } = window;

function doLogin() {
  let { endpointUrl } = liff.getContext();
  liff.login({ redirectUri: `${endpointUrl}?reactRedirectUri=${location.pathname}` });
}

function doLogout() {
  liff.logout();
  location.reload();
}

export default NavBar;
