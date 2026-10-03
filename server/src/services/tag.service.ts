import { TagRepository } from "../repositories/tag.repository.js";
import { normalizeTag } from "../utils/tag.utils.js";

export class TagService {
  constructor(
    private readonly tagRepository: TagRepository
  ) {}

  async searchTags(query?: string) {
    return await this.tagRepository.searchTags(query);
  }

  async findOrCreateTag(name: string) {
    const normalizedName = normalizeTag(name);

    const existingTag =
      await this.tagRepository.findByName(normalizedName);

    if (existingTag) {
      return existingTag;
    }

    try {
      return await this.tagRepository.create(normalizedName);
    } catch (error: any) {
      if (error?.code === "23505") {
        const tag =
          await this.tagRepository.findByName(normalizedName);

        if (tag) {
          return tag;
        }
      }

      throw error;
    }
  }
}