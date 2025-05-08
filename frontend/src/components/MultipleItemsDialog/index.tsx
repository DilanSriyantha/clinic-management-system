import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { InvoiceRecord, ItemDto } from '../../types';

const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 70 },
    { field: "itemCode", headerName: "Item Code", width: 170 },
    { field: "caption", headerName: "Caption", width: 130 },
    { field: "currentQty", headerName: "Curr.Qty", width: 70 },
    { field: "unitSellingPrice", headerName: "Unit Price", width: 70 }
];

const paginationModel = { page: 0, pageSize: 10 };

export interface MultipleItemsDialogProps {
    rows: ItemDto[];
    open: boolean;
    onClose: () => void;
    onConfirm: (item: InvoiceRecord | undefined) => void;
};

export default function MultipleItemsDialog({ rows, open, onClose, onConfirm }: MultipleItemsDialogProps) {
    const [page, setPage] = React.useState<number>(0);
    const [selectedItem, setSelectedItem] = React.useState<InvoiceRecord>();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleSelectRow = React.useCallback((rowSelectionModel: GridRowSelectionModel, _details: GridCallbackDetails<any>): void => {
        const selectedIds = new Set<GridRowId>(rowSelectionModel);
        const item = rows.find(item => selectedIds.has(item.id));

        if(!item) return;

        setSelectedItem({ itemId: item.id, itemCode: item.itemCode, description: item.caption, unitPrice: item.unitSellingPrice, quantity: 0, total: 0  });
    }, [rows, selectedItem]);

    const handlePaginationModelChange = React.useCallback((model: GridPaginationModel, _details: GridCallbackDetails<'pagination'>): void => {
        if(model.page == page) return;
        setPage(model.page);
    }, [page]);

    const handleConfirm = React.useCallback(() => {
        onConfirm(selectedItem);
    }, [selectedItem]);

    const handleClose = React.useCallback(() => {
        onClose();
    }, []); 

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Items"}
                </DialogTitle>
                <DialogContent>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        paginationModel={{ page: page, pageSize: 10 }}
                        onPaginationModelChange={handlePaginationModelChange}
                        paginationMode="server"
                        rowCount={rows.length}
                        pageSizeOptions={[10]}
                        checkboxSelection
                        disableMultipleRowSelection
                        sx={{ border: 0 }}
                        onRowSelectionModelChange={handleSelectRow}
                    />
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