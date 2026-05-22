import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  compareAtPrice?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsObject()
  @IsOptional()
  attributes?: Record<string, string>;
}

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsBoolean()
  @IsOptional()
  isThumbnail?: boolean;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsNumber()
  basePrice: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  @IsArray()
  variants: CreateProductVariantDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  @IsArray()
  @IsOptional()
  images?: CreateProductImageDto[];

  @IsObject()
  @IsOptional()
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  @IsObject()
  @IsOptional()
  specifications?: Record<string, any>;

  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;
}
