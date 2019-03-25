type ValidatorFunction = (any) => any;
declare function validateSchema(a: { [name: string]: mixed }): ValidatorFunction;
declare var APP: mixed;