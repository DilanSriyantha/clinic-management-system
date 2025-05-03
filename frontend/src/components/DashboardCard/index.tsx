import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CurrencyFormatter } from '../../utils/CurrencyFormatter';

interface DashboardCardProps {
    title: string;
    number: number;
    currency?: boolean;
    icon: string;
    bgColor: string;
    loading?: boolean;
};

const DashboardCard: React.FC<DashboardCardProps> = (props) => {
    return (
        <Card sx={{ display: 'flex' }}>
            <Box 
                sx={{
                    display: "flex",
                    bgcolor: props.bgColor,
                    width: 150,
                    height: 150,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CardMedia
                    component="img"
                    sx={{ width: 80 }}
                    image={ props.icon }
                />
            </Box>
            <Box sx={{ display: 'flex', width: "100%", flexDirection: 'column', }}>
                <CardContent sx={{ flex: '1 0 auto', justifyContent: "center" }}>
                    {
                        props.loading
                        ?
                            <>
                                <Skeleton variant='text' height={20} />
                                <Skeleton variant='text' />
                            </>
                        :
                            <>
                                <Typography component="div" variant="h1">
                                    { props.currency ? CurrencyFormatter.format(props.number) : props.number }
                                </Typography>
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    { props.title }
                                </Typography>
                            </>
                    }
                </CardContent>
            </Box>
            
        </Card>
    );
}

export default DashboardCard;