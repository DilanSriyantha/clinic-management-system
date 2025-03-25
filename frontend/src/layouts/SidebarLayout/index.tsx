import * as React from 'react';
import { Box, Snackbar, alpha, lighten, useTheme } from '@mui/material';
import { Outlet } from 'react-router';

import Sidebar from './Sidebar';

interface SidebarLayoutProps {
    children?: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = () => {
    const theme = useTheme();

    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <Box
            sx={{
                flex: 1,
                height: '100%',
                overflow: "auto",
                mt: theme.header.height,

                '.MuiPageTitle-wrapper': {
                    background:
                        theme.palette.mode === 'dark'
                            ? theme.colors.alpha.trueWhite[5]
                            : theme.colors.alpha.white[50],
                    marginBottom: `${theme.spacing(4)}`,
                    boxShadow:
                        theme.palette.mode === 'dark'
                            ? `0 1px 0 ${alpha(
                                lighten(theme.colors.primary.main, 0.7),
                                0.15
                            )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
                            : `0px 2px 4px -3px ${alpha(
                                theme.colors.alpha.black[100],
                                0.1
                            )}, 0px 5px 12px -4px ${alpha(
                                theme.colors.alpha.black[100],
                                0.05
                            )}`
                }
            }}
        >
            {/* <Header /> */}
            <Sidebar />
        </Box>
    );
};

export default SidebarLayout;