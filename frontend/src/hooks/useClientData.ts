import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { listLocations, listTypesIds, listCountries, listClientTypes, listContactTypes } from '../services';
import { AlertType } from '../types/alert';
import { Option } from '../types/Options';
import useTranslations from './useTranslations';

interface UseClientDataProps {
    addAlert: (alert: AlertType) => void;
}

const useClientData = ({ addAlert }: UseClientDataProps) => {
    const {translations} = useTranslations()
    const [locations, setLocations] = useState<Option[]>([]);
    const [typesIds, setTypesIds] = useState<Option[]>([]);
    const [countries, setCountries] = useState<Option[]>([]);
    const [clientTypes, setClientTypes] = useState<Option[]>([]);
    const [contactTypes, setContactTypes] = useState<Option[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationsRes, typesIdsRes, countriesRes, clientTypesRes, contactTypesRes] = await Promise.all([
                    listLocations(),
                    listTypesIds(),
                    listCountries(),
                    listClientTypes(),
                    listContactTypes()
                ]);

                const handleResponse = (response: any) => {
                    if (!response.success) {
                        throw new Error(response.message);
                    }
                    return response.resp.map((option: any) => ({
                        value: option.id,
                        label: option.name,
                    }));
                };

                setLocations(handleResponse(locationsRes.data));
                setTypesIds(handleResponse(typesIdsRes.data));
                setCountries(handleResponse(countriesRes.data));
                setClientTypes(handleResponse(clientTypesRes.data));
                //setClientTypes(..prevValues, [{}])
                setContactTypes(handleResponse(contactTypesRes.data));
            } catch (error: any) {
                addAlert({ id: uuidv4(), text: error.message, type: 'danger', timeout: 3000 });
            }
        };

        fetchData();
    }, [addAlert]);

    return { locations, typesIds, countries, clientTypes, contactTypes };
};

export default useClientData;