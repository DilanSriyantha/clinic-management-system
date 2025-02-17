import { SearchRounded } from "@mui/icons-material";
import { TextField, useTheme } from "@mui/material";

export default function SearchBar() {
    const theme = useTheme();
    
    return (
        <>
            <TextField 
                placeholder="Search..."
                slotProps={{
                    input: {
                        startAdornment: <SearchRounded color={"secondary"} sx={{ mr: 1 }} />
                    }
                }}
            />
        </>
    );
}