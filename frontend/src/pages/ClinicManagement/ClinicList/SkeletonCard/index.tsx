import { Card, CardContent, Skeleton } from "@mui/material";

function SkeletonCard() {

    return (
        <Card sx={{ maxWidth: 345, width: "20%" }}>
            <Skeleton sx={{ height: 140 }} animation="wave" variant="rectangular" />
            <CardContent>
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
            </CardContent>
        </Card>
    );
}

export default SkeletonCard;