import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  CreateProductVariantDto,
} from './dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ============= PRODUCT ENDPOINTS (PUBLIC) =============

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all products with filtering' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  async getFeatured(@Query('limit') limit = 10) {
    return this.productsService.getFeaturedProducts(limit);
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  async search(@Query('q') searchTerm: string, @Query('limit') limit = 20) {
    if (!searchTerm) {
      return { data: [] };
    }
    return this.productsService.searchProducts(searchTerm, limit);
  }

  @Public()
  @Get('id/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get product by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products' })
  async getRelated(@Param('id') id: string, @Query('limit') limit = 5) {
    return this.productsService.getRelatedProducts(id, limit);
  }

  @Public()
  @Get(':id/metadata')
  @ApiOperation({ summary: 'Get product metadata' })
  async getMetadata(@Param('id') id: string) {
    return this.productsService.getProductMetadata(id);
  }

  // ============= PRODUCT ENDPOINTS (ADMIN ONLY) =============

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (admin only)' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product (admin only)' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // ============= VARIANT ENDPOINTS =============

  @Post(':productId/variants')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add variant to product (admin only)' })
  async addVariant(
    @Param('productId') productId: string,
    @Body() createVariantDto: CreateProductVariantDto,
  ) {
    return this.productsService.addVariant(productId, createVariantDto);
  }

  @Patch('variants/:variantId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product variant (admin only)' })
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() updateData: Partial<CreateProductVariantDto>,
  ) {
    return this.productsService.updateVariant(variantId, updateData);
  }

  @Delete('variants/:variantId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product variant (admin only)' })
  async removeVariant(@Param('variantId') variantId: string) {
    return this.productsService.removeVariant(variantId);
  }

  // ============= STOCK MANAGEMENT =============

  @Post('variants/:variantId/reserve-stock')
  @UseGuards(RolesGuard)
  @Roles('admin', 'system')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reserve stock for variant' })
  async reserveStock(
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number,
  ) {
    await this.productsService.reserveStock(variantId, quantity);
    return { success: true };
  }

  @Post('variants/:variantId/release-stock')
  @UseGuards(RolesGuard)
  @Roles('admin', 'system')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Release reserved stock' })
  async releaseStock(
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number,
  ) {
    await this.productsService.releaseStock(variantId, quantity);
    return { success: true };
  }

  // ============= REVIEWS =============

  @Post(':id/reviews')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add review to product' })
  async addReview(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    return this.productsService.addReview(id, userId, rating, comment);
  }

  // ============= CATEGORY ENDPOINTS =============

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  async getCategories() {
    return this.productsService.findAllCategories();
  }

  @Public()
  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getCategory(@Param('id') id: string) {
    return this.productsService.findCategoryById(id);
  }

  @Post('categories')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category (admin only)' })
  async createCategory(
    @Body('name') name: string,
    @Body('description') description?: string,
    @Body('parentId') parentId?: string,
  ) {
    return this.productsService.createCategory(name, description, parentId);
  }

  @Patch('categories/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (admin only)' })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateData: Partial<{ name: string; description: string; parentId: string }>,
  ) {
    return this.productsService.updateCategory(id, updateData);
  }

  @Delete('categories/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category (admin only)' })
  async removeCategory(@Param('id') id: string) {
    return this.productsService.removeCategory(id);
  }
}
