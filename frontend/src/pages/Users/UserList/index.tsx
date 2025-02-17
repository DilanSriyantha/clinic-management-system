import { alpha, Box, Card, Chip, Container, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { useCallback, useEffect, useState } from "react";
import { Check, Delete, Edit, Filter, ReplayOutlined } from "@mui/icons-material";
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";

interface Role {
    value: number;
    label: string;
};

const roles: Role[] = [
    { value: 0, label: "Receptionist" },
    { value: 1, label: "Doctor" },
    { value: 2, label: "Pharmacist" },
];

const recep_columns: GridColDef[] = [
    { field: "refId", headerName: "Ref.ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "birthday", headerName: "Birthday", width: 70 },
    { field: "address", headerName: "Address", width: 130 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "telephone", headerName: "Telephone", width: 100 },
    { field: "regDate", headerName: "Reg.Date", width: 100 },
    { field: "status", headerName: "Status", width: 70 },
];

const doc_columns: GridColDef[] = [
    { field: "refId", headerName: "Ref.ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "birthday", headerName: "Birthday", width: 70 },
    { field: "address", headerName: "Address", width: 130 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "telephone", headerName: "Telephone", width: 100 },
    { field: "specialization", headerName: "Specialization", width: 100 },
    { field: "percentage", headerName: "Percentage(%)", type: "number", width: 70 },
    { field: "regDate", headerName: "Reg.Date", width: 100 },
    { field: "status", headerName: "Status", width: 70 },
]

const doc_rows = [
    { id: 1, refId: "DOC_001", name: 'Snow', birthday: '1997-01-02', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", specialization: "Something", percentage: 20, regDate: "2025-02-16", status: "Active" },
    { id: 2, refId: "DOC_001", name: 'Lannister', birthday: '1783-05-04', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", specialization: "Something", percentage: 20, regDate: "2025-02-16", status: "Active" },
    { id: 3, refId: "DOC_001", name: 'Lannister', birthday: '1256-06-02', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", specialization: "Something", percentage: 20, regDate: "2025-02-16", status: "Active" },
    { id: 4, refId: "DOC_001", name: 'Stark', birthday: '2001-08-07', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", specialization: "Something", percentage: 20, regDate: "2025-02-16", status: "Active" },
    { id: 5, refId: "DOC_001", name: 'Targaryen', birthday: '2012-12-25', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", specialization: "Something", percentage: 20, regDate: "2025-02-16", status: "Active" },
    { id: 6, refId: "DOC_001", name: 'Melisandre', birthday: '2025-01-06', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", specialization: "Something", percentage: 20, regDate: "2025-02-16", status: "Active" },
    { id: 7, refId: "DOC_001", name: 'Clifford', birthday: '2000-05-07', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", specialization: "Something", percentage: 20, regDate: "2025-02-16", status: "Active" },
    { id: 8, refId: "DOC_001", name: 'Frances', birthday: '1996-02-03', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", specialization: "Something", percentage: 20, regDate: "2025-02-16", status: "Active" },
    { id: 9, refId: "DOC_001", name: 'Roxie', birthday: '1236-12-21', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", specialization: "Something", percentage: 20, regDate: "2025-02-16", status: "Active" },
];

const recep_rows = [
    { id: 1, refId: "REC_001", name: 'Snow', birthday: '1997-01-02', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", regDate: "2025-02-16", status: "Active" },
    { id: 2, refId: "REC_001", name: 'Lannister', birthday: '1783-05-04', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", regDate: "2025-02-16", status: "Active" },
    { id: 3, refId: "REC_001", name: 'Lannister', birthday: '1256-06-02', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", regDate: "2025-02-16", status: "Active" },
    { id: 4, refId: "REC_001", name: 'Stark', birthday: '2001-08-07', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", regDate: "2025-02-16", status: "Active" },
    { id: 5, refId: "REC_001", name: 'Targaryen', birthday: '2012-12-25', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", regDate: "2025-02-16", status: "Active" },
    { id: 6, refId: "REC_001", name: 'Melisandre', birthday: '2025-01-06', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", regDate: "2025-02-16", status: "Active" },
    { id: 7, refId: "REC_001", name: 'Clifford', birthday: '2000-05-07', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", regDate: "2025-02-16", status: "Active" },
    { id: 8, refId: "REC_001", name: 'Frances', birthday: '1996-02-03', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", regDate: "2025-02-16", status: "Active" },
    { id: 9, refId: "REC_001", name: 'Roxie', birthday: '1236-12-21', address: "1/12, Some Street, Somewhere", email: "123@email.com", telephone: "0123456789", regDate: "2025-02-16", status: "Active" },
];

const paginationModel = { page: 0, pageSize: 5 };

function UsersList() {
    const [role, setRole] = useState<Role>(roles[0]);
    const [selectedIds, setSelectedIds] = useState<Set<GridRowId>>();

    const handleRoleChange = useCallback((item: Role) => {
        if (role.value === item.value)
            return;

        setRole(item);
    }, [role]);

    const handleSelectRow = useCallback((ids: GridRowSelectionModel) => {
        setSelectedIds(new Set(ids));
    }, [selectedIds]);

    const handleReloadClick = useCallback(() => {

    }, []);

    interface TableToolbarProps {
        numSelected?: number;
    }

    function TableToolbar(props: TableToolbarProps) {
        if (!props.numSelected)
            return null;

        return (
            <Toolbar
                sx={[
                    {
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                    },
                    props.numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    },
                ]}
            >
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {props.numSelected} {props.numSelected > 1 ? "rows" : "row"} selected
                </Typography>
                {props.numSelected == 1 && (
                    <Tooltip title="Edit">
                        <IconButton>
                            <Edit color="primary" />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Delete">
                    <IconButton>
                        <Delete color="error" />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        );
    };

    return (
        <>
            <PageTitle
                subTitle="Users"
                title="Users List"
            />
            <Card>
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: "start" }}>
                        <Stack direction="row" flexWrap="wrap" pb={2} gap={1}>
                            {
                                roles.map((item) => {
                                    const checked = role.value === item.value;
                                    return (
                                        <Chip
                                            key={item.value}
                                            variant={checked ? "filled" : "outlined"}
                                            color={checked ? "primary" : "default"}
                                            label={item.label}
                                            onClick={() => handleRoleChange(item)}
                                            icon={checked ? <Check fontSize="small" /> : <></>}
                                        />
                                    );
                                })
                            }
                        </Stack>
                        <Box 
                            sx={{ pb: 2 }}
                        >
                            <Tooltip title="Reload">
                                <IconButton onClick={handleReloadClick}>
                                    <ReplayOutlined />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Stack>
                    <TableToolbar numSelected={selectedIds?.size} />
                    <DataGrid
                        rows={role.value === 1 ? doc_rows : recep_rows}
                        columns={role.value === 1 ? doc_columns : recep_columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                        onRowSelectionModelChange={handleSelectRow}
                    />
                </Container>
            </Card>
        </>
    );
}

export default UsersList;