import { CategoryRepository } from "../repositories/category.repository.js";

export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository
  ) {}

  async getAllCategories() {
    return await this.categoryRepository.getAllCategories();
  }
}