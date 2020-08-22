/* eslint-disable no-template-curly-in-string */
import {LocaleObject, setLocale} from 'yup';

const ptBR: LocaleObject = {
    mixed: {
        required: '${path} é requerido',
        notType: '${path} é inválido'
    },
    string: {
        max: '${path} precisa ter no máximo ${max} caracteres'
    },
    number: {
        min: '${path} precisa ser no mínimo ${min}'
    }
};

setLocale(ptBR);

export * from 'yup';

// import {LocaleObject, setLocale, addMethod, number, NumberSchema,} from 'yup';
// import {} from 'yup/lib/locale';
// import isValid from "date-fns/isValid";
// import parse from "date-fns/parse";
//
// const ptBr: LocaleObject = {
//     mixed: {
//         required: '${path} é requerido',
//         notType: '${path} é inválido'
//     },
//     string: {
//         max: '${path} precisa ter no máximo ${max} caracteres'
//     },
//     number: {
//         min: '${path} precisa ter no mínimo ${min}'
//     }
// };
//
// const customValidation = {
//     number: {
//         year: '${path} precisa ser no formato YYYY'
//     }
// } as any;
//
// ptBr['number'] = {
//     ...ptBr['number'],
//     ...customValidation['number']
// };
//
// setLocale(ptBr);
// console.log((ptBr['number'] as any)['year']);
//
// addMethod<NumberSchema>(number, 'year', function () {
//     return this.test({
//         message: (ptBr['number'] as any)['year'],
//         test: (value) => {
//             return isValid(parse(value + "", 'yyyy', 0))
//         }
//     })
// });
