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

    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)); // 1000 ms * 3600 s * 24 h

    return differenceInDays;
};