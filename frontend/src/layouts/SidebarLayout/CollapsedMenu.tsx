import { Add, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { ReactNode, useState } from "react";

interface CollapsedMenuProps {
    caption: string,
    to: string,
    icon: ReactNode,
    children?: Array<CollapsedMenuProps>
};

const CollapsedMenu: React.FC<CollapsedMenuProps> = (props) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItem disablePadding sx={{ display: 'block' }}>

            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={props.caption} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout={"auto"} unmountOnExit>
                <List component={"div"} disablePadding>
                    {
                        props.children?.map((item, idx) => (
                            <>
                                <ListItemButton key={idx} sx={{ pl: 4 }}>
                                    <Add>
                                        {item.icon}
                                    </Add>
                                    <ListItemText primary={item.caption} />
                                </ListItemButton>
                            </>
                        ))
                    }
                </List>
            </Collapse>
        </>
    );
}

export default CollapsedMenu;