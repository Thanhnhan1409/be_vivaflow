import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsArray,
  ArrayNotEmpty,
  IsEmail,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function ValidateApiPropRequiredNumber() {
  return applyDecorators(
    Type(() => Number),
    IsNotEmpty(),
    IsNumber(),
    ApiProperty({ type: Number, required: true, nullable: false }),
  );
}

export function ValidateApiPropRequired01() {
  return applyDecorators(
    Type(() => Number),
    IsNotEmpty(),
    IsNumber(),
    IsIn([0, 1]),
    ApiProperty({
      type: Number,
      enum: [0, 1],
      required: true,
      nullable: false,
    }),
  );
}

export function ValidateApiPropOptionalNumber() {
  return applyDecorators(
    Type(() => Number),
    IsOptional(),
    IsNumber(),
    ApiProperty({ type: Number, required: false, nullable: false }),
  );
}

export function ValidateApiPropRequiredString() {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    ApiProperty({ type: String, required: true, nullable: false }),
  );
}

export function ValidateApiPropOptionalString() {
  return applyDecorators(
    IsOptional(),
    IsString(),
    ApiProperty({ type: String, required: false, nullable: false }),
  );
}

export function ValidateApiPropOptional01() {
  return applyDecorators(
    IsOptional(),
    Type(() => Number),
    IsNumber(),
    IsIn([0, 1]),
    ApiProperty({
      type: Number,
      enum: [0, 1],
      required: false,
      nullable: true,
    }),
  );
}

export function ValidateApiPropRequiredListOfNumber() {
  return applyDecorators(
    IsNotEmpty(),
    Type(() => Number),
    IsArray(),
    ArrayNotEmpty(),
    IsNumber({}, { each: true }),
    ApiProperty({
      type: [Number],
      example: [1, 2, 3, 4, 5],
      required: true,
    }),
  );
}

export function ValidateApiPropOptionalListOfNumber() {
  return applyDecorators(
    IsOptional(),
    Type(() => Number),
    IsArray(),
    ArrayNotEmpty(),
    IsNumber({}, { each: true }),
    ApiProperty({
      type: [Number],
      example: [1, 2, 3, 4, 5],
      required: false,
    }),
  );
}

export function ValidateApiPropRequiredListOfString() {
  return applyDecorators(
    IsNotEmpty(),
    Type(() => String),
    IsArray(),
    ArrayNotEmpty(),
    IsString({ each: true }),
    ApiProperty({
      type: [String],
      example: ['abc', 'def', 'g'],
      required: true,
    }),
  );
}

export function ValidateApiPropOptionalListOfString() {
  return applyDecorators(
    IsOptional(),
    Type(() => String),
    IsArray(),
    ArrayNotEmpty(),
    IsString({ each: true }),
    ApiProperty({
      type: [String],
      example: ['abc', 'def', 'g'],
      required: false,
    }),
  );
}

export function ValidateApiPropRequiredListOfEmail() {
  return applyDecorators(
    IsNotEmpty(),
    Type(() => String),
    IsArray(),
    ArrayNotEmpty(),
    IsEmail({}, { each: true }),
    ApiProperty({
      type: [String],
      example: ['example123@gmail.com', 'exampl456@arckipel.com'],
    }),
  );
}

export function ValidateApiPropOptionalListOfEmail() {
  return applyDecorators(
    IsOptional(),
    Type(() => String),
    IsArray(),
    ArrayNotEmpty(),
    IsEmail({}, { each: true }),
    ApiProperty({
      type: [String],
      example: ['example123@gmail.com', 'exampl456@arckipel.com'],
    }),
  );
}
