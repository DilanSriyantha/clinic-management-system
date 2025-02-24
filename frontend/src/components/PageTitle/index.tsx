import { ChevronLeft } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { MouseEvent, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router";

interface PageTitleProps {
    subTitle: string;
    title: string;
    backButton?: boolean;
    endContent?: ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = (props) => {
    const navigate = useNavigate();

    const handleBackPress = useCallback((event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        navigate(-1);
    }, []);

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
                    {
                        props.backButton && (
                            <Box>
                                <IconButton onClick={handleBackPress} sx={{ mt: 1 }}>
                                    <ChevronLeft />
                                    <Typography variant="button">Back</Typography>
                                </IconButton>
                            </Box>
                        )
                    }
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