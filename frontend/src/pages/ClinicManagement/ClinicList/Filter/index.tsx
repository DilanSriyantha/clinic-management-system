import { Archive, Check, Edit, FileCopy, KeyboardArrowDown, MoreHoriz, Sort } from "@mui/icons-material";
import { alpha, Button, Divider, IconButton, Menu, MenuItem, MenuProps, styled } from "@mui/material";
import React, { useState } from "react";

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: 'rgb(55, 65, 81)',
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[300],
        }),
    },
}));

export interface FilterOption {
    label: string;
    value: number;
};

interface FilterProps {
    options: FilterOption[],
    onChange?: (option: FilterOption) => void;
};

const Filter: React.FC<FilterProps> = (props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<FilterOption>(props.options[0]);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelect = (e: React.MouseEvent<HTMLElement>, option: FilterOption) => {
        setSelected(option);
        
        if(props.onChange)
            props.onChange(option);

        handleClose();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                id="demo-customized-button"
                onClick={handleClick}
            >
                <Sort />
            </IconButton>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {
                    props.options?.map((option, idx) => (
                        <MenuItem key={idx} onClick={(e) => handleSelect(e, option)} disableRipple>
                            { selected?.value === option.value && (<Check fontSize="small" />) }
                            {option.label}
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </div>
    );
}

export default Filter;