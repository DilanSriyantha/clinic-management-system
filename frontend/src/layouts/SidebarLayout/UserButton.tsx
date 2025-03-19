import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { deepPurple } from "@mui/material/colors";
import { useAlert } from "../../hooks/useAlert";

function UserButton() {
    const theme = useTheme();

    const [user, setUser] = useAuth();

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const alert = useAlert();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = useCallback(() => {
        setAnchorElUser(null);
        alert.setAlertDialog("Are you sure?", "Are you sure you want to logout?", "Yes", "No", () => setUser(null));
    }, [user]);

    return (
        <>
            <Tooltip title={"Open settings"}>
                <Box ml={'auto'}>
                    <IconButton sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        bgcolor: theme.colors.primary.lighter,
                        borderRadius: 100,
                        gap: 1
                    }} onClick={handleOpenUserMenu}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: deepPurple[500] }}>{user?.user.name.slice(0, 1)}</Avatar>
                        <Typography variant='subtitle1'>{user?.user.name}</Typography>
                    </IconButton>
                </Box>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="user-menu"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: "center" }}>Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <Typography sx={{ textAlign: "center", color: theme.colors.error.light }}>Log Out</Typography>
                    </MenuItem>
                </Menu>
        </>
    );
}

export default UserButton;