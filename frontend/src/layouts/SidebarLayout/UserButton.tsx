import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme } from "@mui/material";
import ProfPic from "../../assets/me.jpg";
import { useState } from "react";
import { useNavigate } from "react-router";

function UserButton() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
        navigate("");
    };

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
                        <Avatar sx={{ width: 24, height: 24 }} src={ProfPic} />
                        <Typography variant='subtitle1'>Admin User</Typography>
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
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: "center", color: theme.colors.error.light }}>Log Out</Typography>
                    </MenuItem>
                </Menu>
        </>
    );
}

export default UserButton;