import { User, createUser } from "@/types/user";
import { useMemo } from "react";
import DynamicForm, { DynamicFormField, DynamicFormFieldType } from "./DynamicForm";
import { deepCopy } from "@/tools/object";
import { Avatar, Box } from "@mui/material";
import { useAppDispatch } from "@/app/hooks";
import { addUser, updateUser } from "@/features/users/state";
import { nop } from "@/tools/nop";

export type EditUserProps = {
    user?: User;
    onClose?: () => void;
}

export default function UserEdit({ user = createUser(), onClose = nop } = {} as EditUserProps) {
    const fields: DynamicFormField[] = useMemo(() => [
        {
            name: "name.title",
            label: "Title",
            type: DynamicFormFieldType.Select,
            required: true,
            value: user.name.title.toLowerCase(),
            options: [
                { value: "Mr", label: "Mr" },
                { value: "Mrs", label: "Mrs" },
                { value: "Miss", label: "Miss" },
                { value: "Ms", label: "Ms" },
                { value: "Dr", label: "Dr" },
            ],
        },
        {
            name: "name.first",
            label: "First Name",
            type: DynamicFormFieldType.Text,
            required: true,
            value: user.name.first,
            validation: (value: string) => {
                if (value.length < 3) {
                    throw new Error("First name must be at least 3 characters");
                }
                return true;
            },
        },
        {
            name: "name.last",
            label: "Last Name",
            type: DynamicFormFieldType.Text,
            required: true,
            value: user.name.last,
        },
        {
            name: "email",
            label: "Email",
            type: DynamicFormFieldType.Email,
            required: true,
            value: user.email,
        },
        {
            name: "location.street.number",
            label: "Street Number",
            type: DynamicFormFieldType.Number,
            required: true,
            value: user.location.street.number,
        },
        {
            name: "location.street.name",
            label: "Street Name",
            type: DynamicFormFieldType.Text,
            required: true,
            value: user.location.street.name,
        },
        {
            name: "location.city",
            label: "City",
            type: DynamicFormFieldType.Text,
            required: true,
            value: user.location.city,
        },
        {
            name: "location.country",
            label: "Country",
            type: DynamicFormFieldType.Text,
            required: true,
            value: user.location.country,
        },
    ], [user]);

    const dispatch = useAppDispatch();

    const isNew = !!user.id;

    const onSubmit = (values: any) => {
        const newUser = deepCopy(user);
        Object.keys(values).forEach((key) => {
            const keys = key.split('.');
            let obj: any = newUser;
            for (let i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = values[key];
        });

        if (isNew) {
            dispatch(addUser(newUser));
        } else {
            dispatch(updateUser(newUser));
        }
    }

    return (
        <>
            <h1>{isNew ? 'Add' : 'Edit'} User</h1>
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '1em' }}>
                <Avatar src={user.picture.medium} alt={user.name.first} sx={{ height: 80, width: 80 }} />
            </Box>
            <DynamicForm fields={fields} onSubmit={onSubmit} onClose={onClose} />
        </>

    )
}
