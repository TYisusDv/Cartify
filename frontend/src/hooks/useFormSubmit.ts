import { useState } from 'react';
import { AlertType } from '../types/alert';
import { v4 as uuidv4 } from 'uuid';

const useFormSubmit = (submitFunction: (formValues: any) => Promise<any>, addAlert: (alert: AlertType) => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formValues: any) => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const response = await submitFunction(formValues);
      return response;
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).response) {
        const response = (err as any).response;
        const data = response.data;

        if (data && typeof data === 'object' && data.resp) {
          const { resp } = data;

          if (Array.isArray(resp)) {
            resp.forEach(msg => addAlert({ id: uuidv4(), text: msg, type: 'danger', timeout: 3000 }));
          } else if (typeof resp === 'object') {
            Object.values(resp).forEach(value => {
              if (Array.isArray(value)) {
                value.forEach(msg => addAlert({ id: uuidv4(), text: msg, type: 'danger', timeout: 3000 }));
              } else if (typeof value === 'string') {
                addAlert({ id: uuidv4(), text: value, type: 'danger', timeout: 3000 });
              }
            });
          } else if (typeof resp === 'string') {
            addAlert({ id: uuidv4(), text: resp, type: 'danger', timeout: 3000 });
          }else {
            addAlert({ id: uuidv4(), text: 'Unexpected error data format', type: 'danger', timeout: 3000 });
          }
        } else {
          addAlert({ id: uuidv4(), text: 'No error data received', type: 'danger', timeout: 3000 });
        }
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};

export default useFormSubmit;
