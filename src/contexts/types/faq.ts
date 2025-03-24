import type { IDateValue } from "./common";

export type IFaqItem = {
    id: string;
    title: string;
    categorie: string;
    reponse?:string;
    statut: string;
    datePublication: IDateValue;
};



export type IFAQTableFilters = {
    title: string;
    categorie: string[];
    statut : string[];
    datePublication: IDateValue;
};
