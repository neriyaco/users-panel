import { nop } from "@/tools/nop";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

export enum DynamicFormFieldType {
  Text = "text",
  Number = "number",
  Email = "email",
  Tel = "tel",
  Url = "url",
  Password = "password",
  Checkbox = "checkbox",
  Select = "select",
}

export interface DynamicFormField {
  name: string;
  label: string;
  type: DynamicFormFieldType;
  required?: boolean;
  value?: any;
  validation?: (value: any) => boolean;
  options?: { value: any; label: string }[];
}

export interface DynamicFormProps {
  fields: DynamicFormField[];
  onSubmit: (values: any) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function DynamicForm({
  fields,
  onSubmit = nop,
  onClose = nop,
  onCancel = onClose,
}: DynamicFormProps) {
  const [formFields, setFormFields] = useState(fields);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    for (const field of formFields) {
      if (field.required && !field.value) {
        setErrorMessage(`${field.label} is required`);
        return;
      }
      if (field.validation) {
        try {
          if (!field.validation(field.value)) {
            setErrorMessage(`${field.label} is invalid`);
            return;
          }
        } catch (error: any) {
          setErrorMessage(error.message);
          return;
        }
      }
    }
    const values = formFields.reduce((values, field) => {
      values[field.name] = field.value;
      return values;
    }, {} as any);
    onSubmit(values);
    onClose();
  };

  const closeErrorMessage = () => {
    setErrorMessage("");
  };

  const createInput = (field: DynamicFormField) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      switch (field.type) {
        case DynamicFormFieldType.Number:
          field.value = Number(e.target.value);
          break;
        default:
          field.value = e.target.value;
      }
      setFormFields([...formFields]);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      field.value = e.target.checked;
      setFormFields([...formFields]);
    };

    const handleSelectChange = (e: SelectChangeEvent<{ value: unknown }>) => {
      field.value = e.target.value;
      setFormFields([...formFields]);
    };

    switch (field.type) {
      case DynamicFormFieldType.Text:
      case DynamicFormFieldType.Number:
      case DynamicFormFieldType.Email:
      case DynamicFormFieldType.Tel:
      case DynamicFormFieldType.Url:
      case DynamicFormFieldType.Password:
        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            // required={field.required}
            value={field.value}
            variant="standard"
            onChange={handleChange}
          />
        );
      case DynamicFormFieldType.Checkbox:
        return (
          <Checkbox
            key={field.name}
            name={field.name}
            required={field.required}
            checked={field.value}
            onChange={handleCheckboxChange}
          />
        );
      case DynamicFormFieldType.Select:
        return (
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-label">{field.label}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={field.value}
              label={field.label}
              onChange={handleSelectChange}
            >
              {field.options?.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  selected={option.value === field.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <Box key={field.name} sx={{ marginBottom: "1em" }}>
            <InputLabel htmlFor={field.name} sx={{ display: "none" }}>
              {field.label}
            </InputLabel>
            {createInput(field)}
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button color="error" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Box>
      </Box>

      {errorMessage && (
        <Snackbar
          open={errorMessage !== ""}
          autoHideDuration={3000}
          onClose={closeErrorMessage}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      )}
    </>
  );
}
