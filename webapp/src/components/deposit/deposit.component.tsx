import { useState, useContext } from 'react';
import { AuthenticationContext, User, Authentication } from '../../contexts/authentication.context';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import { DepositContainer } from "./deposit.styles";


const Deposit = () => {
    const { currentAuthentication: currentAuthentication, setCurrentAuthentication: setCurrentAuthentication } = useContext(AuthenticationContext);
    const [deposit, setDeposit] = useState<number | ''>();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await fetch('/transactions/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentAuthentication?.accessToken}`
            },
            body: JSON.stringify({ deposit }),
        });
        const bodyText = await response.text();
        const result = JSON.parse(bodyText) as User;
        setDeposit('');
        if (response.ok) {
            // alert('Deposit added successfully!');
            const updatedAuth = { ...currentAuthentication, user: result } as Authentication;
            setCurrentAuthentication(updatedAuth);
        } else {
            const error = JSON.parse(bodyText);
            alert(`Error depositing funds: ${error.message}`);
        }
    };

    const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
        const { value } = event.target as HTMLInputElement;
        setDeposit(parseFloat(value));
    };

    return (
        <DepositContainer>
            <form onSubmit={handleSubmit}>
                <h2>Deposit: {currentAuthentication?.user.deposit} cents</h2>
                <span>Add money in order to buy products</span>
                <FormInput
                    label='Deposit:'
                    type='text'
                    required
                    onChange={handleChange}
                    name='deposit'
                    value={deposit}
                />
                <br />
                <Button type="submit">Submit</Button>
            </form>
        </DepositContainer>
    );
}

export default Deposit;