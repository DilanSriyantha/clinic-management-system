import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '../../assets/dashboard_24dp_00_FILL0_wght400_GRAD0_opsz24.svg';
import InventoryIcon from '../../assets/inventory_2_24dp_00_FILL0_wght400_GRAD0_opsz24.svg';
import ReportingIcon from '../../assets/summarize_24dp_00_FILL0_wght400_GRAD0_opsz24.svg';
import BackupIcon from '../../assets/desktop_cloud_stack_24dp_00_FILL0_wght400_GRAD0_opsz24.svg';
import UserButton from './UserButton';
import AdvancedMenuItem from './AdvancedMenuItem';
import { Accessible, EditCalendar, GroupOutlined, InsertDriveFileTwoTone, LocalHospital, Medication } from '@mui/icons-material';
import { CalendarIcon } from '@mui/x-date-pickers';
import { Outlet } from 'react-router';

const drawerWidth = 240;

const menuOptions = [
    {
        caption: "Dashboard",
        to: "/",
        icon: <img src={DashboardIcon} />
    },
    {
        caption: "Schedule Management",
        icon: <CalendarIcon htmlColor="#fff" />,
        children: [
            {
                caption: "Create Event",
                to: "schedule-management/create",
                icon: <InsertDriveFileTwoTone />
            }
        ]
    },
    {
        caption: "Users",
        icon: <GroupOutlined htmlColor='#fff'/>,
        children: [
            {
                caption: "Create Account",
                to: "users/create",
                icon: <InsertDriveFileTwoTone />
            },
            {
                caption: "Users List",
                to: "users/list",
                icon: <InsertDriveFileTwoTone />
            }
        ]
    },
    {
        caption: "Patient Management",
        icon: <Accessible htmlColor='#fff'/>,
        children: [
            {
                caption: "Create Patient",
                to: "patient-management/create",
                icon: <InsertDriveFileTwoTone />
            },
            {
                caption: "Patients List",
                to: "patient-management/list",
                icon: <InsertDriveFileTwoTone />
            }
        ]
    },
    {
        caption: "Prescription Management",
        icon: <Medication htmlColor='#fff'/>,
        children: [
            {
                caption: "Create Prescription",
                to: "prescription-management/create",
                icon: <InsertDriveFileTwoTone />
            },
            {
                caption: "Prescriptions List",
                to: "prescription-management/list",
                icon: <InsertDriveFileTwoTone />
            }
        ]
    },
    {
        caption: "Clinic Management",
        icon: <LocalHospital htmlColor='#fff' />,
        children: [
            {
                caption: "Clinics List",
                to: "clinic-management/list",
                icon: <InsertDriveFileTwoTone />
            },
            {
                caption: "Create Clinic",
                to: "clinic-management/create",
                icon: <InsertDriveFileTwoTone />
            }
        ]
    },
    {
        caption: "Appointment Management",
        icon: <EditCalendar htmlColor='#fff'/>,
        children: [
            {
                caption: "Create Appointment",
                to: "appointment-management/create",
                icon: <InsertDriveFileTwoTone />
            },
            {
                caption: "Appointment List",
                to: "appointment-management/list",
                icon: <InsertDriveFileTwoTone />
            }
        ]
    },
    // {
    //     caption: "Doctor Management",
    //     icon: <img src={StethoscopeIcon} />,
    //     children: [
    //         {
    //             caption: "Patient Queue",
    //             to: "doctor-management/queue",
    //             icon: <InsertDriveFileTwoTone />
    //         },
    //         {
    //             caption: "Prescription",
    //             to: "doctor-management/prescription",
    //             icon: <InsertDriveFileTwoTone />
    //         },
    //         {
    //             caption: "Lab Requests",
    //             to: "doctor-management/lab-requests",
    //             icon: <InsertDriveFileTwoTone />
    //         },
    //         {
    //             caption: "Patients",
    //             to: "doctor-management/patients",
    //             icon: <InsertDriveFileTwoTone />
    //         },
    //     ]
    // },
    // {
    //     caption: "Billing & Payment",
    //     to: "billing",
    //     icon: <img src={BillingIcon} />
    // },
    {
        caption: "Pharmacy Sales Management",
        icon: <img src={InventoryIcon} />,
        children: [
            {
                caption: "Create Invoice",
                to: "pharmacy-sales-management/create-invoice",
                icon: <InsertDriveFileTwoTone />
            }, 
            {
                caption: "Invoice List",
                to: "pharmacy-sales-management/invoice-list",
                icon: <InsertDriveFileTwoTone />
            }
        ]
    },
    {
        caption: "Pharmacy Stock Management",
        icon: <img src={InventoryIcon} />,
        children: [
            {
                caption: "Create Item",
                to: "pharmacy-stock-management/create",
                icon: <InsertDriveFileTwoTone />
            },
            {
                caption: "Items List",
                to: "pharmacy-stock-management/list",
                icon: <InsertDriveFileTwoTone />
            }
        ]
    },
    {
        caption: "Reporting & Analysis",
        to: "reporting",
        icon: <img src={ReportingIcon} />
    },
    {
        caption: "Backup & Restore",
        to: "backup",
        icon: <img src={BackupIcon} />
    }
]

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const OutletContainer = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })<{ open: boolean }>(
    ({ theme, open }) => ({
        marginLeft: `75px`,
        transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        ...(open && {
            marginLeft: `240px`,
            transition: theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }),
);

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Sidebar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }} noWrap component="div">
                            Clinic Management System (CMS) by PPAG7
                        </Typography>
                        <UserButton />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton color='inherit' onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {menuOptions.map((obj, index) => (
                            <AdvancedMenuItem
                                key={index}
                                caption={obj.caption}
                                to={obj.to}
                                drawerOpened={open}
                                icon={obj.icon}
                                openDrawer={handleDrawerOpen}
                                children={obj.children}
                            />
                        ))}
                    </List>
                </Drawer>
            </Box>
            <OutletContainer
                sx={{
                    position: 'relative',
                    zIndex: 5,
                    display: 'block',
                    flex: 1,
                }}
                open={open}
            >
                <Outlet />
            </OutletContainer>
        </>
    );
}