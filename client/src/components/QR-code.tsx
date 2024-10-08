import React, { useState } from 'react';
import axios from 'axios';

const QRcode: React.FC = () => {
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>(undefined);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(e.target.value));
    };

    const generateQR = async () => {
        try {
            const response = await axios.post('http://localhost:3000/payment/generateQR', { amount });
            setQrCodeUrl(response.data.Result);
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    return (
        <div>
            <input
                type="number"
                id="amount"
                className='text-white'
                placeholder="amount"
                value={amount || ''}
                onChange={handleInputChange}
            />
            <button onClick={generateQR}>Generate</button>
            {qrCodeUrl && <img id="imgqr" src={qrCodeUrl} alt="QR Code" style={{ width: '500px', objectFit: 'contain' }} />}
        </div>
    );
};

export default QRcode;