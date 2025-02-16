import { Box, Card, Chip, Container, Stack } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { useCallback, useState } from "react";
import { Check } from "@mui/icons-material";

interface Role {
    value: number;
    label: string;
};

const roles: Role[] = [
    { value: 0, label: "Receptionist" },
    { value: 1, label: "Doctor" },
    { value: 2, label: "Pharmacist" },
];

function UsersList() {
    const [role, setRole] = useState<Role>(roles[0]);

    const handleRoleChange = useCallback((item: Role) => {
        if (role.value === item.value)
            return;

        setRole(item);
    }, [role]);

    return (
        <>
            <PageTitle
                subTitle="Users"
                title="Users List"
            />
            <Card
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}
            >
                <Container sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 2,
                    pb: 2
                }}>
                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "start" }}>
                        <Stack direction="row" flexWrap="wrap" pb={1} gap={1}>
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
                    </Box>
                </Container>
            </Card>
        </>
    );
}

export default UsersList;