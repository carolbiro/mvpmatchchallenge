import { FormInputLabel, Input, Group } from './form-input.styles';

interface FormInputProps {
    label: string;
    [key: string]: any;
}

const FormInput = ({ label, ...otherProps }: FormInputProps) => {
    return (
        <Group>
            <Input {...otherProps as { value?: string }} />
            {label && (
                <FormInputLabel shrink={otherProps.value?.length}>
                    {label}
                </FormInputLabel>
            )}
        </Group>
    );
}

export default FormInput;
