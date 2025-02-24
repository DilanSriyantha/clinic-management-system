import { VisibilityOff, Visibility } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import React, { ChangeEvent, MouseEvent, useCallback, useState } from "react";

interface PasswordInputFieldProps {
    defaultValue?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onClick?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
    error?: boolean;
};

const PasswordInputField: React.FC<PasswordInputFieldProps> = (props) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleShowPwClick = useCallback((e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    return (
        <TextField
            defaultValue={props.defaultValue}
            name="password"
            variant="outlined"
            label="Password*"
            type={showPassword ? "text" : "password"}
            error={props.error}
            onClick={props.onClick}
            onChange={props.onChange}
            slotProps={{
                input: {
                    endAdornment:
                        <>
                            <IconButton
                                aria-label={
                                    showPassword ? "hide the password" : "display the passowrd"
                                }
                                onClick={handleShowPwClick}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </>
                }
            }}
        />
    );
};

export default PasswordInputField;