export interface ICSVFields{
    number:string;
    numberRegExp?:RegExp;
    numberconverter?(number:string):string;
    date:string;
    description:string;
}