import { Type, applyDecorators } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export function ApiPropNumber() {
  return applyDecorators(Expose(), ApiProperty({ type: Number }));
}

export function ApiPropNumberOptional() {
  return applyDecorators(
    Expose(),
    ApiProperty({ type: Number, required: false }),
  );
}

export function ApiPropString() {
  return applyDecorators(Expose(), ApiProperty({ type: String }));
}

export function ApiPropStringOptional() {
  return applyDecorators(
    Expose(),
    ApiProperty({ type: String, required: false }),
  );
}

export function ApiPropBool() {
  return applyDecorators(Expose(), ApiProperty({ type: Boolean }));
}

export function ApiPropDate() {
  return applyDecorators(Expose(), ApiProperty({ type: Date }));
}

export function ApiPropUnix() {
  return applyDecorators(
    Expose(),
    ApiProperty({
      type: Number,
      description: 'unix-timestamp',
      example: '1717507046',
    }),
  );
}

export function ApiPropUnixOptional() {
  return applyDecorators(
    Expose(),
    ApiProperty({
      type: Number,
      description: 'unix-timestamp',
      example: '1717507046',
      required: false,
      nullable: false,
    }),
  );
}

export function ApiPropType(
  // eslint-disable-next-line @typescript-eslint/ban-types
  type: Type<unknown> | Function | [Function] | string | Record<string, any>,
) {
  return applyDecorators(Expose(), ApiProperty({ type: type }));
}

export function ApiPropTypeOptional(
  // eslint-disable-next-line @typescript-eslint/ban-types
  type: Type<unknown> | Function | [Function] | string | Record<string, any>,
) {
  return applyDecorators(
    Expose(),
    ApiProperty({ type: type, required: false }),
  );
}

export function ApiPropEnum(enumType: any[] | Record<string, any>) {
  return applyDecorators(Expose(), ApiProperty({ enum: enumType }));
}

export function ApiPropEnumOptional(enumType: any[] | Record<string, any>) {
  return applyDecorators(
    Expose(),
    ApiProperty({ enum: enumType, required: false, nullable: false }),
  );
}
