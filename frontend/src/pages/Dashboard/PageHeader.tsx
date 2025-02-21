import { Avatar, Box, Skeleton, Typography, useTheme } from "@mui/material";
import userImg from "../../assets/user.png";
import { useAuth } from "../../hooks/useAuth";


function PageHeader() {
    const theme = useTheme();

    const [user, setUser] = useAuth();

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
                {
                    user 
                    ?
                        <>
                            <Typography
                                variant="h3"
                                component="h3"
                                gutterBottom
                            >
                                { `Welcome, ${user.user.name}` }
                            </Typography>
                            <Typography
                                variant="subtitle2"
                            >
                                Manage your resources with an ease!
                            </Typography>
                        </>
                    : 
                        <>
                            <Skeleton variant="text" width={200} height={30}/>
                            <Skeleton sx={{
                                mt: 1
                            }} variant="text" width={200}/>
                        </>
                }
            </Box>
        </Box>
    );
}

export default PageHeader;