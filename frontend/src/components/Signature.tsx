import { CleanIcon } from 'hugeicons-react';
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

type SignaturePadProps = {
    onSave: (signature: string) => void;
};

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const clear = () => {
        sigCanvas.current?.clear();
    };

    const saveSignature = () => {
        if (sigCanvas.current?.isEmpty()) {
            return; 
        }
        else if (!sigCanvas.current) {
            return;
        }

        const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        onSave(signature); 
    };

    return (
        <div className='flex gap-2'>
            <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                    height: 100,
                    style: { width: '100%', border: '1px solid #000', background: '#fff' },
                }}
                onEnd={saveSignature}
            />
            <div>
                <button type='button' onClick={clear} className='btn rounded-xl btn-yellow w-10 h-full'>
                    <CleanIcon />
                </button>
            </div>
        </div>
    );
};

export default SignaturePad;
