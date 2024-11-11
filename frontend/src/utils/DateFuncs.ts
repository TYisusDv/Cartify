export interface BirthdateProps {
  birthdate: string | null;
}

export const calculateAge = (birthdate: string) => {
    if(birthdate){
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    }
  
    return '';
};

export const calculateDaysRemaining = (dateLimit?: Date) => {
    if (!dateLimit) return undefined;

    const today = new Date();
    const limitDate = new Date(dateLimit);

    const differenceInTime = limitDate.getTime() - today.getTime();

    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
};

export const UTCToLocalTime = (utcDate?: string) => {
    if(!utcDate){
        return null;
    }

    const localDate = new Date(utcDate);
  
    const formattedDate = localDate.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  
    return formattedDate;
  };

  export const UTCToLocalTimeInput = (utcDate?: string) => {
    if(!utcDate){
        return null;
    }

    const localDate = new Date(utcDate);

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  };