export interface TableType {
    query: string;
    filters: any,
}

export interface SelectGroupType {
    query: string;
    search: string;
}

export interface Option {
    value: any;
    text: any;
    object?: any;
}

export interface CustomChangeEvent extends React.ChangeEvent<HTMLSelectElement> {
    object: any;
}