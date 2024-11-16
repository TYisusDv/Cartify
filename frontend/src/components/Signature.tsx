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

    const save = () => {
        if (sigCanvas.current?.isEmpty()) {
            alert("Por favor, realiza la firma antes de guardar.");
            return;
        } else if (!sigCanvas.current) {
            alert("Por favor, realiza la firma antes de guardar.");
            return;
        }

        const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        onSave(signature);
    };

    return (
        <>
            <div className='flex justify-center'>
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                        width: 400,
                        height: 200,
                        style: { border: '1px solid #000', background: "#fff" },
                    }}
                />
            </div>
            <div className='flex gap-2 mt-2'>
                <button onClick={clear} className={`btn btn-yellow h-10`}>
                    Limpiar firma
                </button>
                <button onClick={save} className={`btn btn-blue h-10`}>
                    Guardar firma
                </button>
            </div>
        </>
    );
};

export default SignaturePad;
