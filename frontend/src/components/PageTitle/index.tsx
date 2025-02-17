import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface PageTitleProps {
    subTitle: string;
    title: string;
    endContent?: ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = (props) => {

    return (
        <Box sx={{
            pb: 5
        }}>
            <Stack direction="row" justifyContent="space-between">
                <Box sx={{
                    display: "flex",
                    textAlign: "start",
                    flexDirection: "column"
                }}>
                    <Typography variant="subtitle1">{props.subTitle}</Typography>
                    <Typography variant="h1" sx={{ fontWeight: 400 }}>{props.title}</Typography>
                </Box>
                <>
                    { props.endContent }
                </>
            </Stack>
        </Box>
    );
}

export default PageTitle;