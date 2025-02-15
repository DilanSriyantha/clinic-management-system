import { Box, Typography } from "@mui/material";

interface PageTitleProps {
    subTitle: string;
    title: string;
}

const PageTitle: React.FC<PageTitleProps> = (props) => {

    return (
        <Box sx={{
            display: "flex",
            textAlign: "start",
            flexDirection: "column",
            pb: 5
        }}>
            <Typography variant="subtitle1">{props.subTitle}</Typography>
            <Typography variant="h1" sx={{ fontWeight: 400 }}>{props.title}</Typography>
        </Box>
    );
}

export default PageTitle;