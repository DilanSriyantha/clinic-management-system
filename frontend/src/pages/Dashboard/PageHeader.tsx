import { Avatar, Box, Typography, useTheme } from "@mui/material";
import userImg from "../../assets/user.png";

function PageHeader() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
            }}
        >
            <Avatar
                sx={{
                    mr: 2,
                    width: theme.spacing(8),
                    height: theme.spacing(8)
                }}
                variant="rounded"
                alt={"user"}
                src={userImg}
            />
            <Box sx={{
                display: 'flex',
                textAlign: "start",
                flexDirection: 'column',
            }}>
                <Typography
                    variant="h3"
                    component="h3"
                    gutterBottom
                >
                    Welcome, UserName
                </Typography>
                <Typography
                    variant="subtitle2"
                >
                    Manage your resources with an ease!
                </Typography>
            </Box>
        </Box>
    );
}

export default PageHeader;