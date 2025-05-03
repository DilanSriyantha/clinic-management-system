import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { ChangeEvent, useCallback } from "react";
import { CreateInvoiceState } from "../../pages/PharmacySalesManagement/CreateInvoice";

interface PaymentConfirmationProps {
    open: boolean;
    onClose: () => void;
    onPaidAmountChange: (paidAmount: number) => void;
    onConfirm: () => void;
    invoice: CreateInvoiceState;
};

export default function PaymentConfirmation({ open, onClose, onPaidAmountChange, onConfirm, invoice }: PaymentConfirmationProps) {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClose = useCallback(() => {
        onClose();
    }, []);

    const handlePaidAmountChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        onPaidAmountChange(Number(event.target.value));
    }, []);

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                aria-labelledby="responsive-dialog-title"
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Confirm payment..."}
                </DialogTitle>
                <DialogContent>
                    <Box width={"100%"}>
                        <Grid2 container size={12} spacing={1}>
                            <Grid2 container size={6}>
                                <Grid2 size={6}>
                                    <Typography variant="h6">Grand Total</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography variant="h6">{invoice.subtotal.toFixed(2)}</Typography>
                                </Grid2>
                            </Grid2>
                            <Grid2 container size={6}>
                                <Grid2 size={6}>
                                    <Typography variant="h6">Paid</Typography>
                                    <Typography variant="h6">Balance</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField variant="standard" placeholder="Paid amount" type="number" focused onChange={handlePaidAmountChange}/>
                                    <Typography variant="h6">{invoice.balance.toFixed(2)}</Typography>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleConfirm} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}