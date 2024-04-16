import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UseData } from './FormDataContext';

export default function ForgotPassword() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { email } = UseData();
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            return setErrorMessage('Please fill OTP.');
        }
        try {
            setLoading(true);
            setErrorMessage(null);
            const res = await fetch('/api/auth/verifyOTP', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, email }), // Include email in formData sent to backend
            });
            const data = await res.json();
            console.log(email)
            if (data.success === false) {
                return setErrorMessage(data.message);
            }
            setLoading(false);
            if (res.ok) {
                navigate('/reset-password');
            }
        } catch (error) {
            setErrorMessage(error.message);
            setLoading(false);
        }
    };
    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 max-w-sm mx-auto flex-col md:flex-row md:items-center gap-5'>
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <Label value='Enter OTP:' />
                            <TextInput
                                type='number'
                                id='otp_f'
                                onChange={(e) => {
                                    // Ensure the length of the entered OTP is restricted to 6 digits
                                    const enteredOtp = e.target.value.slice(0, 6);
                                    setOtp(enteredOtp);
                                }}
                            />
                        </div>

                        <Button
                            gradientDuoTone='purpleToPink'
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Loading...</span>
                                </>
                            ) : (
                                'Send OTP'
                            )}
                        </Button>
                    </form>

                    {errorMessage && (
                        <Alert className='mt-5' color='failure'>
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
