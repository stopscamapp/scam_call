export interface ICSVFields{
    number:string;
    numberRegExp?:RegExp;
    numberconverter?(number:string):string;
    date:string;
    dateConverter?(date:string|null):Date|null;
    description:string;
}