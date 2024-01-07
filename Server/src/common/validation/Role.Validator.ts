import { Role } from '@prisma/client';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class MatchRole implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const valid = Role.hasOwnProperty(args.value);
    return valid; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `Role doesn't match. Should be one of ${Object.keys(Role)}`;
  }
}
