export interface TableType {
    query: string;
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