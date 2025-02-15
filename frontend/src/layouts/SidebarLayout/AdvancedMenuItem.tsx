import { Add, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import React, { ReactNode, useCallback, useState } from "react";
import { NavLink } from "react-router";

interface ChildrenProps {
    caption: string;
    to: string;
    icon: ReactNode;
}

interface AdvancedMenuItemProps {
    caption: string;
    to?: string;
    icon: ReactNode;
    drawerOpened: boolean;
    openDrawer?: () => void;
    children?: Array<ChildrenProps>;
};

interface ListItemBodyProps {
    isRouteActive: boolean;
}

const AdvancedMenuItem: React.FC<AdvancedMenuItemProps> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [activeRoute, setActiveRoute] = useState<string>(props.caption);

    const handleClick = useCallback(() => {
        if(!props.drawerOpened)
            return;
        setOpen(!open);
    }, [open, props.drawerOpened]);

    const handleNavClick = useCallback((to: string) => {
        if(activeRoute.match(to))
            return;

        setActiveRoute(to);
    }, [activeRoute]);

    const handleCollapsedMenuClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        if(props.openDrawer)
            props.openDrawer();
    }, []);

    const ListItemBody: React.FC<ListItemBodyProps> = (_props): ReactNode => {
        return (
            <ListItemButton selected={_props.isRouteActive} sx={{
                minHeight: 48,
                justifyContent: props.drawerOpened ? 'initial' : 'center',
                px: 2.5,
                textWrap: props.drawerOpened ? 'wrap' : 'nowrap'
            }} onClick={handleClick}>
                <ListItemIcon sx={{
                    minWidth: 0,
                    mr: props.drawerOpened ? 3 : 'auto',
                    justifyContent: 'center',
                }}>
                    {props.icon}
                </ListItemIcon>
                <ListItemText sx={{ opacity: props.drawerOpened ? 1 : 0 }} primary={props.caption} />
                {props.drawerOpened ? props.children ? open ? <ExpandLess /> : <ExpandMore /> : null : null}
            </ListItemButton>
        );
    }

    return (
        <>
            <ListItem disablePadding sx={{ display: 'block' }}>
                {
                    props.to
                        ?
                        <Tooltip title={props.caption} placement="right-end">
                            <NavLink to={props.to} style={{ color: "inherit" }}>
                                {({ isActive }) => (
                                    <ListItemBody isRouteActive={isActive} />
                                )}
                            </NavLink>
                        </Tooltip>
                        :
                        <Tooltip title={props.caption} placement="right-end">
                            <NavLink to={activeRoute} style={{ color: "inherit" }} onClick={handleCollapsedMenuClick}>
                                {({ isActive }) => (
                                    <ListItemBody isRouteActive={isActive} />
                                )}
                            </NavLink>
                        </Tooltip>
                }
            </ListItem>
            {
                props.children && props.drawerOpened
                    ?
                    <Collapse in={open} timeout={"auto"} unmountOnExit>
                        <List component={"div"} disablePadding>
                            {
                                props.children?.map((item, idx) => (
                                    <NavLink key={idx} to={item.to} onClick={() => handleNavClick(item.to)} style={{ color: "inherit" }}>
                                        {({ isActive }) => (
                                            <ListItemButton selected={isActive} key={idx} sx={{ pl: 4 }}>
                                                {item.icon}
                                                <ListItemText sx={{ pl: 1 }} primary={item.caption} />
                                            </ListItemButton>
                                        )}
                                    </NavLink>
                                ))
                            }
                        </List>
                    </Collapse>
                    : null
            }
        </>
    );
}

export default AdvancedMenuItem;