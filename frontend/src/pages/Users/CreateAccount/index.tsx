import { Autocomplete, Box, Button, Card, Chip, Container, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import { DatePicker } from "@mui/x-date-pickers";
import { FormEvent, useCallback, useRef, useState } from "react";
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

const specializationOptions = [
    { label: "Surgeon", id: 0 },
    { label: "Specialist", id: 1 }
];

function CreateAccount() {
    const formRef = useRef<HTMLFormElement>(null);

    const [role, setRole] = useState<Role>(roles[0]);

    const handleSubmit = useCallback((e: FormEvent) => {
        if (!formRef.current)
            return;

        const form = formRef.current;
        const formData = new FormData(form);
        const name = formData.get("name");
        const bday = formData.get("birthday");
        const addr = formData.get("address");
        const email = formData.get("email");
        const tel = formData.get("telephone");
        const spec = formData.get("specialization");
        const prof = formData.get("profit-percentage");

        alert(`${name} ${bday} ${addr} ${email} ${tel} ${spec} ${prof}`);
    }, []);

    const handleClear = useCallback((e: FormEvent) => {
        window.location.reload();
    }, []);

    const handleRoleChange = useCallback((item: Role) => {
        if (role.value === item.value)
            return;

        setRole(item);
    }, [role]);

    return (
        <>
            <PageTitle
                subTitle={"Users"}
                title={"Create Account"}
            />
            <Card>
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
                    <Box sx={{
                        textAlign: "start",
                        pb: 2,
                    }}>
                        <Typography variant="subtitle2">*Please fill the information required.</Typography>
                    </Box>
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            paddingBottom: 2,
                            width: "100%"
                        }}>
                            <TextField name="name" label="Name" type="text" />
                            <DatePicker name="birthday" label="Birthday" format="YYYY-MM-DD" />
                            <TextField name="address" label="Address" type="text" />
                            <TextField name="email" label="E-mail" type="email" />
                            <TextField name="telephone" label="Telephone" type="tel" />
                            {
                                (role.value == 1) &&
                                <>
                                    <Autocomplete
                                        // disablePortal
                                        options={specializationOptions}
                                        renderInput={(params) => <TextField {...params} name="specialization" label="Specialization" />}
                                    />
                                    <TextField name="profit-percentage" label="Profit Percentage" type="number" slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                                        }
                                    }} />
                                </>
                            }
                        </Box>
                    </form>
                    <Box sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                    }}>
                        <Button variant="outlined" type="reset" onClick={handleClear}>Clear</Button>
                        <Button variant="contained" type="submit" onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Container>
            </Card>
        </>
    )
}

export default CreateAccount;