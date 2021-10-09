import React from "react";
import { useField } from "formik";
import { TextField } from "@mui/material";

/**
 *
 * @param {import("@mui/material").TextFieldProps} props
 */
function FormikTextField(props) {
    const { name, ...rest } = props;
    const [field, { error }] = useField({ name, type: name });
    return (
        <TextField {...field} {...rest} error={!!error} helperText={error} />
    );
}

export default FormikTextField;
